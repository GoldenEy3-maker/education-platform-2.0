import { type User as PrismaUser } from "@prisma/client";
import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] &
      Omit<PrismaUser, "password" | "tokenVersion">;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Omit<PrismaUser, "password" | "tokenVersion"> {}
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        login: { label: "Логин" },
        password: { label: "Пароль" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials.password)
          throw new Error("Неверный логин или пароль!");

        const user = await db.user.findUnique({
          where: {
            login: credentials.login,
          },
        });

        if (!user) throw new Error("Неверный логин или пароль!");

        const isPasswordsMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordsMatch) throw new Error("Неверный логин или пароль!");

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === "development",
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
