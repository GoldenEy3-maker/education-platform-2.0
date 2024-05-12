import {
  createUploadthing,
  type FileRouter as UtFileRouter,
} from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  uploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 10 },
    video: { maxFileCount: 2, maxFileSize: "512MB" },
    text: { maxFileCount: 10, maxFileSize: "16MB" },
    pdf: { maxFileCount: 10, maxFileSize: "16MB" },
    blob: { maxFileCount: 10, maxFileSize: "512MB" },
    audio: { maxFileCount: 10, maxFileSize: "32MB" },
  }).onUploadComplete(async ({ file }) => {
    // This code RUNS ON YOUR SERVER after upload

    console.log("file url", file.url);

    // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
    return { url: file.url };
  }),
} satisfies UtFileRouter;

export type FileRouter = typeof fileRouter;
