import { conn } from "@/_lib/db/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: "my-secret",
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        address: {
          label: "Address",
          type: "text",
          placeholder: "0x...",
        },
      },
      // @ts-ignore
      async authorize(credentials, req) {
        if (!credentials || !credentials.address) {
          return null;
        }

        let sql = "SELECT * FROM User WHERE account_address = ?;";
        let query;
        try {
          query = await conn.execute(sql, [credentials.address]);
        } catch (e) {
          console.log(e);
          return null;
        }
        console.log(query);
        let user = query.rows[0];
        console.log("user should be:");
        console.log(user);

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          const newUser = {
            // @ts-ignore
            id: user.id,
            // @ts-ignore
            name: user.name,
            // @ts-ignore
            email: user.account_address,
          };
          return newUser;
        } else {
          return null;
        }
      },
    }),
  ],
};
