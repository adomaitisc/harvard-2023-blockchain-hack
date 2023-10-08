import { conn } from "@/_lib/db/client";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../_utils/auth-options";

type requestBody = {
    driver: number,
    passenger: number,
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)
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
    let trip_confirmed_id = uuidv4();    
    try{
        const { driver, passenger } = data
    
        let sql
        let query

        const passenger_id = "SELECT account_id FROM AccountTrips where account_trip_id = (?);"
        query = await conn.execute(passenger_id, [
            passenger,
        ])
    
        const driver_id = "SELECT account_id FROM AccountTrips where account_trip_id = (?);"
        query = await conn.execute(driver_id, [
            driver
        ])

        const driver_prefences_id  = "SELECT driver_preferences_id FROM AccountTrips where account_trip_id = (?);"
        query = await conn.execute(driver_prefences_id, [
            driver
        ])

        const price = "SELECT price FROM DriverPreferences where driver_preferences_id = (?);"
        query = await conn.execute(price, [
            driver_prefences_id
        ])
        
        sql = "INSERT INTO TripConfirmed (account_trip_id, trip_confimed_id) VALUES (?, ?);"
        query = await conn.execute(sql, [
            driver,
            trip_confirmed_id
        ]);
        
        sql = "INSERT INTO TripPassengers (trip_confirmed_id, account_trip_id) VALUES (?, ?);"
        query = await conn.execute(sql, [
            trip_confirmed_id,
            passenger
        ]);
        
        return new Response(JSON.stringify({
            succes: true,
            message: "Trip confirmed succesfully",
        }), { status: 200 })
        
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
    
    async function transferToken( signerAddress: string, toAddress: string, amount: number, addressContract: string ) {
        const transferABI = {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'function'
          }

    }