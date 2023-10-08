import { conn } from "@/_lib/db/client"
import { NextResponse } from "next/server";
import { uuid } from 'uuidv4';

type requestBody = {
    origin: string,
    destination: string,
    trip: "Regular" | "One-time",
    time?: string,
    datetime?: Date,
    schedule?: number
}

export async function POST(request: Request) {
    const data: requestBody = await request.json()
    let trip_id = uuid()
    try {
        const { origin, destination, trip } = data
        if (trip == "Regular") {
            const { time, schedule } = data
            let sql = "INSERT INTO RegularTrips (trip_id, origin, destination, time, schedule) VALUES (?, ?, ?, ?, ?);"
            let query = await conn.execute(sql, [
                trip_id, origin, destination, time, schedule
            ])
            return NextResponse.json({ 
                success: true,
                trip_id: query.insertId
            })
        } else if (trip == "One-time") {
            const { datetime } = data
            let sql = "INSERT INTO OnetimeTrip (trip_id, origin, destination, datetime) VALUES (?, ?, ?, ?);"
            let query = await conn.execute(sql, [
                trip_id, origin, destination, datetime
            ])
            return NextResponse.json({
                success: true,
                trip_id: query.insertId
            })
        }
    }
    catch {
        return NextResponse.json({
            success: false,
            message: "An error occurred while processing your request."
        })
    }
  }