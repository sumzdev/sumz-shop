import client from "@libs/server/client";
import { NextApiHandler, NextApiRequest } from "next";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import bcrypt from "bcrypt";
import { Session, User } from "@prisma/client";
import { randomBytes, randomUUID } from "crypto";

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
    CredentialsProvider({
      id: "email-password-credeintials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req: NextApiRequest) {
        if (!credentials) {
          throw new Error("잘못된 입력값으로 인한 오류가 발생했습니다.");
        }
        const { email, password } = credentials;
        const exUser = await client.user.findUnique({
          where: { email },
          include: {
            sessions: true,
          },
        });

        if (!exUser) {
          throw new Error("notExist");
        }

        if (!exUser.password) {
          throw new Error("other");
        }

        const result = await bcrypt.compare(password, exUser.password);
        if (!result) {
          throw new Error("notEqual");
        }

        return exUser as any;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token, user }) {
      // console.log(session, token, user);

      if (token) {
        session.id = token.sub;
      }

      // console.log(session, token, user);
      const exUser = await client.user.findFirst({
        where: { id: Number(session.id) },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          favlist: true,
          cartlist: true,
        },
      });

      session.user = exUser;

      return session;
    },
  },
  redirect: async ({ url, baseUrl }) => {
    Promise.resolve(url);
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
