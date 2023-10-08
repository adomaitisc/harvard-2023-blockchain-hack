// get closest trips

import { getDistance } from "geolib";
import { conn } from "@/_lib/db/client";
import { OnetimeTrip, RegularTrip } from "@/_lib/db/types";
import Link from "next/link";

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

async function fetchAllTrips() {
  let sql = "SELECT * FROM ";
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
          <h2 className="text-sm text-zinc-500">Commutes close to you</h2>
          {/* LIST OF CLOSE TRIPS */}
        </div>
      </div>
    </>
  );
}
