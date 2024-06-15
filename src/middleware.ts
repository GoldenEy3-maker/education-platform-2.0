import { withAuth } from "next-auth/middleware";
import { env } from "./env.js";
import { PagePathMap } from "./libs/enums";

export default withAuth({
  pages: {
    signIn: PagePathMap.Auth,
  },
  callbacks: {
    async authorized({ req }) {
      const sessionToken = req.cookies.get("next-auth.session-token");

      if (sessionToken == null) return false;

      const res = await fetch(
        `${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "http://localhost:3000"}/api/user/check-session?token=${sessionToken.value}`,
      );

      if (res.status === 404) return false;

      return true;
    },
  },
  secret: env.NEXTAUTH_SECRET,
});

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|reset-password).*)",
  ],
};
