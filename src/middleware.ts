import { withAuth } from "next-auth/middleware";
import { env } from "./env.js";
import { PagePathMap } from "./libs/enums";

export default withAuth({
  pages: {
    signIn: PagePathMap.Auth,
  },
  callbacks: {
    authorized({ req }) {
      const sessionToken = req.cookies.get("next-auth.session-token");
      return sessionToken != null;
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
