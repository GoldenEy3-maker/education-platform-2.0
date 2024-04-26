import { withAuth } from "next-auth/middleware";
import { env } from "./env";
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
  matcher: ["/:path*"],
};
