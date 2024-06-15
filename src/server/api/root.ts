import { createTRPCRouter } from "~/server/api/trpc";
import { courseRouter } from "./routers/course";
import { userRouter } from "./routers/user";
import { lectureRouter } from "./routers/lecture";
import { quizRouter } from "./routers/quiz";
import { mailerRouter } from "./routers/mailer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: courseRouter,
  user: userRouter,
  lecture: lectureRouter,
  quiz: quizRouter,
  mailer: mailerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
