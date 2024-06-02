import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Prisma, type User as PrismaUser } from "@prisma/client";
import bcrypt from "bcrypt";
import { getCookie, setCookie } from "cookies-next";
import {
  type GetServerSidePropsContext,
  type NextApiRequest,
  type NextApiResponse,
} from "next";
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
    user: DefaultSession["user"] & PrismaUser;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends PrismaUser {}
}

export const authOptions = (req: NextApiRequest, res: NextApiResponse) => {
  const adapter = PrismaAdapter(db);

  return [
    req,
    res,
    {
      adapter: adapter,
      providers: [
        CredentialsProvider({
          credentials: {
            login: { label: "Логин", type: "text" },
            password: { label: "Пароль", type: "password" },
          },
          authorize: async (credentials) => {
            if (!credentials?.login || !credentials.password)
              throw new Error("Неверный логин или пароль!");

            const user = await db.user.findUnique({
              where: {
                login: credentials.login,
              },
              include: {
                favorites: true,
                subscriptions: true,
              },
            });

            if (!user) throw new Error("Неверный логин или пароль!");

            const isPasswordsMatch = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isPasswordsMatch)
              throw new Error("Неверный логин или пароль!");

            return user;
          },
        }),
      ],
      callbacks: {
        async session({ user, session }) {
          return { ...session, user: user };
        },
        async redirect({ url }) {
          return url;
        },
        async signIn({ user }) {
          if (user) {
            const sessionToken = crypto.randomUUID();
            const sessionExpiry = new Date(
              Date.now() + 60 * 60 * 24 * 30 * 1000,
            );

            if (adapter.createSession) {
              await adapter.createSession({
                sessionToken,
                userId: user.id,
                expires: sessionExpiry,
              });
            }

            setCookie("next-auth.session-token", sessionToken, {
              req,
              res,
              expires: sessionExpiry,
            });
          }
          return true;
        },
      },
      secret: env.NEXTAUTH_SECRET,
      jwt: {
        maxAge: 60 * 60 * 24 * 30,
        async encode() {
          const cookie = getCookie("next-auth.session-token", { req, res });

          if (cookie) return cookie;
          return "";
        },
        async decode() {
          return null;
        },
      },
      debug: env.NODE_ENV === "development",
      events: {
        async signOut({ session }) {
          const { sessionToken = "" } = session as unknown as {
            sessionToken?: string;
          };

          if (sessionToken && adapter.deleteSession) {
            await adapter.deleteSession(sessionToken);
          }
        },
      },
    } as NextAuthOptions,
  ] as const;
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(
    ...authOptions(ctx.req as NextApiRequest, ctx.res as NextApiResponse),
  );
};
