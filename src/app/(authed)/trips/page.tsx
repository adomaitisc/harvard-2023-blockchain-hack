import { getServerSession } from "next-auth";
import { authOptions } from "../../api/_utils/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { conn } from "@/_lib/db/client";
import { AccountTrips, OnetimeTrip, RegularTrip } from "@/_lib/db/types";
import { decimalSumToDaysOfWeek } from "@/lib/utils";

async function getAccountTrips(account_address: string) {
  let sql = "SELECT * FROM AccountTrips WHERE account_id = ?;";
  let query;
  try {
    query = await conn.execute(sql, [account_address, account_address]);
  } catch (e) {
    console.log(e);
  }
  if (!query) return [];
  return query.rows as AccountTrips[];
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) return redirect("/");

  const accountTrips = await getAccountTrips(session.user.email);

  console.log(accountTrips);

  return (
    <div className="max-w-lg w-full flex flex-col items-center justify-end pb-10 gap-4">
      <Link
        href="/home"
        className=" px-3 py-2 bg-violet-600 rounded-lg shadow-md text-white text-sm hover:bg-violet-500 duration-200"
      >
        Plan a Commute
      </Link>
      {accountTrips.map((trip) => (
        <TripCard trip={trip} key={trip.trip_id} />
      ))}
    </div>
  );
}

async function getRegularTrip(trip_id: string) {
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

async function getOnetimeTrip(trip_id: string) {
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

async function TripCard({ trip }: { trip: AccountTrips }) {
  // fetch trip data
  let tripData;

  if (trip.trip === "Regular") {
    tripData = await getRegularTrip(trip.trip_id);
  } else {
    tripData = await getOnetimeTrip(trip.trip_id);
  }

  if (!tripData) return null;

  let days;
  if (trip.trip === "Regular") {
    // @ts-ignore
    days = decimalSumToDaysOfWeek(tripData.schedule);
  }

  return (
    <Link
      href={`/${tripData.trip_id}`}
      className="bg-white rounded-2xl shadow-sm p-4 w-full flex flex-col gap-2 border border-zinc-100 hover:border-zinc-200 duration-200"
    >
      <div className="flex flex-col">
        <h2 className="font-medium">{tripData.destination_formatted}</h2>
        <p className="text-zinc-500 text-sm">{tripData.origin_formatted}</p>
      </div>
      <div className="flex gap-2">
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
    </Link>
  );
}
