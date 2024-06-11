import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
