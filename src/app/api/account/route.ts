import { conn } from "@/_lib/db/client";
import { signIn } from "next-auth/react";

export async function POST(request: Request) {
  // get address and name from body
  const { address, name } = await request.json();

  if (!address || !name) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid data",
      }),
      { status: 400 }
    );
  }

  // check if user exists
  let sql = "SELECT * FROM User WHERE account_address = ?;";
  let query;
  try {
    query = await conn.execute(sql, [address]);
  } catch (e) {
    console.log(e);
    return null;
  }
  console.log(query);
  let user = query.rows[0];
  if (user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User already exists",
        address,
      }),
      { status: 400 }
    );
  }

  // create user
  sql = "INSERT INTO User (account_address, name) VALUES (?, ?);";
  try {
    query = await conn.execute(sql, [address, name]);
  } catch (e) {
    console.log(e);
    return null;
  }
  return new Response(
    JSON.stringify({
      success: true,
      message: "User created",
      address,
    }),
    { status: 200 }
  );
}
