import { NextApiHandler } from "next";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import client from "../../../libs/server/client";

const options = {
  adapter: PrismaAdapter(client),
  providers: [
    KakaoProvider({
      clientId: String(process.env.KAKAO_CLIENT_ID),
      clientSecret: String(process.env.KAKAO_CLIENT_SECRET),
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
