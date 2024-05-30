import {
  createUploadthing,
  type FileRouter as UtFileRouter,
} from "uploadthing/next-legacy";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
  image: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).onUploadComplete(
    async ({ file }) => {
      return { ...file };
    },
  ),
  uploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 20 },
    video: { maxFileSize: "512MB", maxFileCount: 20 },
    text: { maxFileSize: "16MB", maxFileCount: 20 },
    pdf: { maxFileSize: "16MB", maxFileCount: 20 },
    blob: { maxFileSize: "512MB", maxFileCount: 20 },
    audio: { maxFileSize: "32MB", maxFileCount: 20 },
  }).onUploadComplete(async ({ file }) => {
    return { ...file };
  }),
} satisfies UtFileRouter;

export type FileRouter = typeof fileRouter;

export const utapi = new UTApi();
