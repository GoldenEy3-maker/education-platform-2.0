import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import bcrypt from "bcrypt";
import { utapi } from "~/server/uploadthing";
import { getUploadUrlKey } from "~/libs/utils";

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
  updateProfile: protectedProcedure
    .input(
      z.object({
        bgImage: z.string().optional(),
        avatar: z.string().optional(),
      }),
    )
    .mutation(async (opts) => {
      const updateData = () => {
        const bgImage = opts.input.bgImage;
        const avatar = opts.input.avatar;

        if (opts.ctx.session.user.bgImage && bgImage)
          void utapi.deleteFiles(
            getUploadUrlKey(opts.ctx.session.user.bgImage),
          );

        if (opts.ctx.session.user.image && avatar)
          void utapi.deleteFiles(getUploadUrlKey(opts.ctx.session.user.image));

        if (bgImage && avatar) {
          return {
            bgImage,
            image: avatar,
          };
        }

        return bgImage ? { bgImage } : { image: avatar };
      };

      const updatedUser = await opts.ctx.db.user.update({
        where: {
          id: opts.ctx.session.user.id,
        },
        data: updateData(),
      });

      return updatedUser;
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        current: z.string(),
        new: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const user = await opts.ctx.db.user.findUnique({
        where: {
          id: opts.ctx.session.user.id,
        },
      });

      if (!user) throw new Error("Пользователь не найден!");

      const isPasswordMatch = await bcrypt.compare(
        opts.input.current,
        user?.password,
      );

      if (!isPasswordMatch) throw new Error("Неверный пароль!");

      const updatedUser = await opts.ctx.db.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: await bcrypt.hash(opts.input.new, 10),
        },
      });

      return updatedUser;
    }),
});
