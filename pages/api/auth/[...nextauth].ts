import { NextApiHandler } from "next";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import client from "../../../libs/server/client";

const options = {
  adapter: PrismaAdapter(client),
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
