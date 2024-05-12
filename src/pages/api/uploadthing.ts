import { createRouteHandler } from "uploadthing/next-legacy";
import { env } from "~/env";

import { fileRouter } from "~/server/uploadthing";

export default createRouteHandler({
  router: fileRouter,
  config: {
    uploadthingId: env.UPLOADTHING_APP_ID,
    uploadthingSecret: env.UPLOADTHING_SECRET,
    isDev: env.NODE_ENV === "development",
    logLevel: "error",
  },
});
