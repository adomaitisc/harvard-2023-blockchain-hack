import { conn } from "@/_lib/db/client"
import { v4 as uuidv4 } from 'uuid';

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
    let trip_id = uuidv4()
    try {
        const { origin, destination, trip } = data
        if (trip == "Regular") {
            const { time, schedule } = data
            let sql = "INSERT INTO RegularTrip (trip_id, origin, destination, time, schedule) VALUES (?, ?, ?, ?, ?);"
            let query = await conn.execute(sql, [
                trip_id, origin, destination, time, schedule
            ])
            return new Response(JSON.stringify({ 
                success: true,
                trip_id: query.insertId,
                message: "Stored succesfully"
            }), { status: 200 })
        } else if (trip == "One-time") {
            const { datetime } = data
            let sql = "INSERT INTO OnetimeTrip (trip_id, origin, destination, datetime) VALUES (?, ?, ?, ?);"
            let query = await conn.execute(sql, [
                trip_id, origin, destination, datetime
            ])
            return new Response(JSON.stringify({
                success: true,
                trip_id: query.insertId,
                message: "Stored succesfully"
            }), {status: 200})
        }
    }
    catch (e){
        console.log(e)
        return new Response(JSON.stringify({
            success: false,
            message: "An error occurred while processing your request."
        }), {status:500})
    }
  }