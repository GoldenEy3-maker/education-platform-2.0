import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  getAll: publicProcedure.query(async (opts) => {
    const courses = await opts.ctx.db.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            image: true,
            name: true,
            surname: true,
            fathername: true,
          },
        },
        favoritedBy: {
          select: {
            userId: true,
          },
        },
        subscribers: {
          select: {
            userId: true,
          },
        },
      },
    });

    return courses;
  }),
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
    .input(
      z.object({
        fullTitle: z.string(),
        shortTitle: z.string().optional(),
        image: z.string(),
        description: z.string().optional(),
        attachments: z.array(
          z.object({
            originalName: z.string(),
            key: z.string().optional(),
            url: z.string(),
            size: z.number().optional(),
            uploadedAt: z.date(),
          }),
        ),
      }),
    )
    .mutation(async (opts) => {
      const newCourse = await opts.ctx.db.course.create({
        data: {
          fullTitle: opts.input.fullTitle,
          shortTitle: opts.input.shortTitle,
          image: opts.input.image,
          authorId: opts.ctx.session.user.id,
          description: opts.input.description,
          attachments: {
            createMany: {
              data: opts.input.attachments.map((attachment) => ({
                name: attachment.originalName,
                url: attachment.url,
                size: attachment.size,
                uploadedAt: attachment.uploadedAt,
                key: attachment.key,
              })),
            },
          },
        },
      });

      return newCourse;
    }),

  deleteAttachment: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async (opts) => {
      return await utapi.deleteFiles(opts.input.key);
    }),
});
