import { z } from "zod";
import { utapi } from "~/server/uploadthing";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { getUploadUrlKey } from "~/libs/utils";

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
            progress: true,
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
          favoritedBy: {
            select: {
              userId: true,
            },
          },
          subscribers: {
            include: {
              user: {
                select: {
                  id: true,
                  fathername: true,
                  name: true,
                  surname: true,
                  image: true,
                  email: true,
                  group: true,
                },
              },
            },
          },
          author: {
            select: {
              id: true,
              fathername: true,
              surname: true,
              name: true,
              status: true,
              image: true,
            },
          },
          attachments: true,
          tasks: {
            include: {
              attachments: true,
              strictViewGroups: true,
              strictViewUsers: true,
              attempts: {
                include: {
                  user: {
                    select: {
                      id: true,
                      group: true,
                      image: true,
                      name: true,
                      surname: true,
                      fathername: true,
                    },
                  },
                },
              },
            },
          },
          announcements: {
            include: {
              attachments: true,
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

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullTitle: z.string(),
        shortTitle: z.string().optional(),
        image: z.string(),
        imageToDelete: z.string().optional(),
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
        attachmentsToDelete: z
          .array(
            z.object({
              id: z.string(),
              key: z.string().nullable(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async (opts) => {
      const updatedCourse = await opts.ctx.db.course.update({
        where: {
          id: opts.input.id,
        },
        data: {
          fullTitle: opts.input.fullTitle,
          shortTitle: opts.input.shortTitle,
          description: opts.input.description,
          image: opts.input.image,
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

      if (opts.input.imageToDelete) {
        await utapi.deleteFiles(getUploadUrlKey(opts.input.imageToDelete));
      }

      if (
        opts.input.attachmentsToDelete &&
        opts.input.attachmentsToDelete.length > 0
      ) {
        await utapi.deleteFiles(
          opts.input.attachmentsToDelete
            .filter((attachemnt) => attachemnt.key)
            .map((attachment) => attachment.key!),
        );

        await opts.ctx.db.courseAttachment.deleteMany({
          where: {
            id: {
              in: opts.input.attachmentsToDelete.map(
                (attachment) => attachment.id,
              ),
            },
          },
        });
      }

      return updatedCourse;
    }),

  favorite: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async (opts) => {
      const favoritedCourse = await opts.ctx.db.favorite.create({
        data: {
          courseId: opts.input.courseId,
          userId: opts.ctx.session.user.id,
        },
      });

      return favoritedCourse;
    }),

  unfavorite: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async (opts) => {
      const removedFavoriteCourse = await opts.ctx.db.favorite.deleteMany({
        where: {
          courseId: opts.input.courseId,
          userId: opts.ctx.session.user.id,
        },
      });

      return removedFavoriteCourse;
    }),

  subscribe: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async (opts) => {
      const subscribedCourse = await opts.ctx.db.subscription.create({
        data: {
          progress: 0,
          courseId: opts.input.courseId,
          userId: opts.ctx.session.user.id,
        },
      });

      return subscribedCourse;
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async (opts) => {
      const unsubscribedCourse = await opts.ctx.db.subscription.deleteMany({
        where: {
          courseId: opts.input.courseId,
          userId: opts.ctx.session.user.id,
        },
      });

      return unsubscribedCourse;
    }),

  deleteAttachment: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async (opts) => {
      return await utapi.deleteFiles(opts.input.key);
    }),
});
