import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const course = await opts.ctx.db.course.findFirst({
        where: {
          id: opts.input.id,
        },
        include: {
          tasks: {
            include: {
              attempts: {
                where: {
                  userId: opts.ctx.session.user.id,
                },
              },
            },
          },
        },
      });

      return course;
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async (opts) => {
      return opts.input;
    }),
});
