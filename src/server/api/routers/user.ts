import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  getCreatedCourses: protectedProcedure.query(async (opts) => {
    const courses = await opts.ctx.db.course.findMany({
      where: {
        authorId: opts.ctx.session.user.id,
      },
      include: {
        tasks: {
          select: {
            section: true,
          },
        },
      },
    });

    return courses;
  }),
  getStudents: protectedProcedure.query(async (opts) => {
    const students = await opts.ctx.db.user.findMany({
      where: {
        role: "Student",
      },
      include: {
        group: true,
      },
    });

    return students;
  }),
  resetPassword: publicProcedure
    .input(z.object({ password: z.string(), id: z.string() }))
    .mutation(async (opts) => {
      const updatedUser = await opts.ctx.db.user.update({
        where: {
          id: opts.input.id,
        },
        data: {
          password: await bcrypt.hash(opts.input.password, 10),
        },
      });

      await opts.ctx.db.session.deleteMany({
        where: {
          userId: updatedUser.id,
        },
      });

      return updatedUser;
    }),
});
