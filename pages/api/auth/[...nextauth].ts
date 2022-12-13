import client from "@libs/server/client";
import { NextApiHandler } from "next";
import NextAuth from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import bcrypt from "bcrypt";

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
      name: "sumz",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
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
          throw new Error("존재하지 않는 아이디입니다.");
        }

        if (!exUser.password) {
          throw new Error("다른 로그인 방식을 이용해 주세요.");
        }

        const result = await bcrypt.compare(password, exUser.password);
        if (!result) throw new Error("비밀번호가 일치하지 않습니다.");
        console.log(exUser);

        return exUser as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      const exUser = await client.user.findUnique({
        where: { email: session.user?.email },
        select: {
          id: true,
          email: true,
          role: true,
          favlist: true,
          cartlist: true,
        },
      });

      session.user = exUser;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
