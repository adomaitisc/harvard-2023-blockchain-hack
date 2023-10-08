// get closest trips

import { getDistance } from "geolib";
import { conn } from "@/_lib/db/client";
import { AccountTrips, OnetimeTrip, RegularTrip } from "@/_lib/db/types";
import Link from "next/link";
import { decimalSumToDaysOfWeek } from "@/lib/utils";
import { Transact } from "./transact";

async function fetchOnetimeTrip(trip_id: string) {
  let sql = "SELECT * FROM OnetimeTrip WHERE trip_id = ?;";
  let query;
  try {
    query = await conn.execute(sql, [trip_id]);
  } catch (e) {
    console.log(e);
  }
  if (!query) return null;
  return query.rows[0] as OnetimeTrip;
}

async function fetchAllTrips(driver: boolean) {
  let sql = "SELECT * FROM AccountTrips WHERE driver_preferences_id IS NULL;";
  if (!driver) {
    sql = "SELECT * FROM AccountTrips WHERE driver_preferences_id IS NOT NULL;";
  }

  let query;

  try {
    query = await conn.execute(sql);
  } catch (e) {
    console.log(e);
  }
  if (!query) return null;
  return query.rows as (OnetimeTrip | RegularTrip)[];
}

async function fetchRegularTrip(trip_id: string) {
  let sql = "SELECT * FROM RegularTrip WHERE trip_id = ?;";
  let query;
  try {
    query = await conn.execute(sql, [trip_id]);
  } catch (e) {
    console.log(e);
  }
  if (!query) return null;
  return query.rows[0] as RegularTrip;
}

function getFiveClosets(
  coords: [number, number],
  trips: (OnetimeTrip | RegularTrip)[]
) {
  if (!trips) return null;
  // organize trips into coords and distance
  const tripCoords = trips.map((trip) => {
    return {
      coords: [trip.origin_latitude, trip.origin_longitude],
      distance: getDistance(coords, [
        trip.origin_latitude,
        trip.origin_longitude,
      ]),
      trip: trip,
    };
  });

  // sort by distance
  tripCoords.sort((a, b) => a.distance - b.distance);

  // return 5 closest trips
  return tripCoords.slice(0, 5);
}

async function fetchAccountTrip(trip_id: string) {
  let sql = "SELECT * FROM AccountTrips WHERE trip_id = ?;";
  let query;
  try {
    query = await conn.execute(sql, [trip_id]);
  } catch (e) {
    console.log(e);
  }
  if (!query) return null;
  return query.rows[0] as AccountTrips;
}

export default async function TripPage({
  params,
}: {
  params: { trip_id: string };
}) {
  // fetch trip data
  let tripData;

  tripData = await fetchOnetimeTrip(params.trip_id);
  if (!tripData) {
    tripData = await fetchRegularTrip(params.trip_id);
  }

  let trip = await fetchAccountTrip(params.trip_id);

  const isDriver = trip.driver_preferences_id ? true : false;

  let trips = await fetchAllTrips(isDriver);

  console.log(trips);

  if (trips.length > 5) {
    const closestOrigins = getFiveClosets(
      // @ts-ignore
      [tripData.origin_latitude, tripData.origin_longitude],
      trips
    );

    const closestDestinations = getFiveClosets(
      // @ts-ignore
      [tripData.destination_latitude, tripData.destination_longitude],
      trips
    );

    // @ts-ignore
    trips = [...closestOrigins, ...closestDestinations];
    // remove duplicated
    const seen = new Set();
    let filteredTrips = trips.filter((el) => {
      // @ts-ignore
      const duplicate = seen.has(el.trip.trip_id);
      // @ts-ignore
      seen.add(el.trip.trip_id);
      return !duplicate;
    });

    trips = filteredTrips.sort((a, b) => a.distance - b.distance);
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/trips"
          className=" px-3 py-2 bg-violet-600 rounded-lg shadow-md text-white text-sm hover:bg-violet-500 duration-200"
        >
          Back to Trips
        </Link>
        <Link
          href="/home"
          className=" px-3 py-2 bg-violet-600 rounded-lg shadow-md text-white text-sm hover:bg-violet-500 duration-200"
        >
          Plan a Commute
        </Link>
      </div>
      <div className="w-full h-screen max-w-lg flex-1 bg-white border border-zinc-200 shadow-lg p-8 rounded-2xl">
        <span className="font-medium">{tripData?.origin_formatted}</span>
        <br />
        to{" "}
        <span className="font-medium">{tripData?.destination_formatted}</span>
        <div className="mt-6 flex flex-col gap-2">
          {isDriver ? (
            <p className="bg-violet-600 text-white rounded-full px-2 py-1 inline-block mr-auto text-xs">
              You are the driver
            </p>
          ) : (
            <h2 className="text-sm text-zinc-500">Commutes close to you</h2>
          )}
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {trips &&
            trips.map((tripp) => (
              <TripCard
                trip={tripp}
                key={tripp.trip_id}
                isDriver
                user_trip_id={trip!.trip_id}
              />
            ))}
        </div>
      </div>
    </>
  );
}

async function TripCard({
  trip,
  isDriver,
  user_trip_id,
}: {
  trip: AccountTrips;
  isDriver: boolean;
  user_trip_id: string;
}) {
  // fetch trip data
  let tripData;
  console.log("TRIP TRIP TRIP");
  console.log(trip);

  if (trip.trip === "Regular") {
    tripData = await fetchRegularTrip(trip.trip_id);
  } else {
    tripData = await fetchOnetimeTrip(trip.trip_id);
  }

  if (!tripData) return null;

  let days;
  // @ts-ignore
  if (trip.trip === "Regular" && tripData.schedule > 0) {
    // @ts-ignore
    days = decimalSumToDaysOfWeek(tripData.schedule);
  }

  let passenger;
  let driver;
  switch (isDriver) {
    case true:
      passenger = trip.trip_id;
      driver = user_trip_id;
      break;
    case false:
      passenger = user_trip_id;
      driver = trip.trip_id;
      break;
    default:
      console.log("vechad");
      break;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full flex flex-col gap-2 border border-zinc-100 hover:border-zinc-200 duration-200">
      <Transact
        passenger={Number.parseInt(passenger!)}
        driver={Number.parseInt(driver!)}
      >
        <div className="flex flex-col">
          <h2 className="font-medium">
            from: {tripData.destination_formatted}
          </h2>
          <p className="text-zinc-500 text-sm">
            to: {tripData.origin_formatted}
          </p>
        </div>
        <div className="flex gap-2 w-full overflow-hidden">
          {isDriver && (
            <p className="text-sm text-violet-600 font-medium">Driver</p>
          )}
          <p className="text-sm text-zinc-500">
            {/* @ts-ignore */}
            {tripData.datetime || tripData.time}
          </p>
          <p className="flex items-center gap-2 justify-center">
            {/* loop through days pls */}
            {days?.map((day) => (
              <span className="text-sm text-zinc-500">{day}</span>
            ))}
          </p>
        </div>
      </Transact>
    </div>
  );
}
