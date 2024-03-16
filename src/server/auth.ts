import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
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
