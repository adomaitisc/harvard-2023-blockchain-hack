import { conn } from "@/_lib/db/client";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../_utils/auth-options";

type requestBody = {
  origin_formatted: string;
  origin_latitude: string;
  origin_longitude: string;
  destination_formatted: string;
  destination_latitude: string;
  destination_longitude: string;
  trip: "Regular" | "One-time";
  time?: string;
  datetime?: Date;
  schedule?: number;
  price?: number;
  seats?: number;
  driver: boolean;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response(
      JSON.stringify({
        succes: false,
        status: 401,
        message: "Error, no session initialized.",
      })
    );
  }
  const data: requestBody = await request.json();
  console.log(data);
  let trip_id = uuidv4();
  try {
    let query;
    let sql;
    const {
      destination_formatted,
      destination_latitude,
      destination_longitude,
      trip,
      origin_formatted,
      origin_latitude,
      origin_longitude,
    } = data;
    if (trip == "Regular") {
      const { time, schedule } = data;
      sql =
        "INSERT INTO RegularTrip (origin_formatted, destination_formatted, trip_id, origin_latitude, origin_longitude, destination_latitude, destination_longitude, time, schedule) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
      query = await conn.execute(sql, [
        origin_formatted,
        destination_formatted,
        trip_id,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        time,
        schedule,
      ]);
    } else if (trip == "One-time") {
      const { datetime } = data;
      sql =
        "INSERT INTO OnetimeTrip (origin_formatted, destination_formatted, trip_id, origin_latitude, origin_longitude, destination_latitude, destination_longitude, datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
      query = await conn.execute(sql, [
        origin_formatted,
        destination_formatted,
        trip_id,
        origin_latitude,
        origin_longitude,
        destination_latitude,
        destination_longitude,
        datetime,
      ]);
    }

    // trip_id = query!.insertId
    if (!trip_id) {
      return new Response(
        JSON.stringify({
          succes: false,
          message: "Error, creating trip",
        }),
        { status: 500 }
      );
    }

    const { driver } = data;

    if (driver) {
      const { price, seats } = data;
      sql = "INSERT INTO DriverPreferences (seats, price) VALUES (?, ?);";
      query = await conn.execute(sql, [seats, price]);

      let driver_preferences_id = query.insertId;
      const account_id = session.user.email;
      sql =
        "INSERT INTO AccountTrips (account_id, trip_id, trip, driver_preferences_id) VALUES (?, ?, ?, ?);";
      query = await conn.execute(sql, [
        account_id,
        trip_id,
        trip,
        driver_preferences_id,
      ]);
    }
    if (!driver) {
      const account_id = session.user.email;
      sql =
        "INSERT INTO AccountTrips (account_id, trip_id, trip) VALUES (?, ?, ?);";
      query = await conn.execute(sql, [account_id, trip_id, trip]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        trip_id: query?.insertId,
        message: "Stored succesfully",
      }),
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An error occurred while processing your request.",
      }),
      { status: 500 }
    );
  }
}
