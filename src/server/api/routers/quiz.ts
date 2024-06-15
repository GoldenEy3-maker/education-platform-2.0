import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const quizRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        section: z.string(),
        title: z.string(),
        content: z.string(),
        strictViewUsers: z.array(z.string()),
        strictViewGroups: z.array(z.string()),
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
      const newQuiz = await opts.ctx.db.task.create({
        data: {
          courseId: opts.input.courseId,
          section: opts.input.section,
          title: opts.input.title,
          type: "Quiz",
          content: opts.input.content,
          strictViewUsers: {
            createMany: {
              data: opts.input.strictViewUsers.map((userId) => ({ userId })),
            },
          },
          strictViewGroups: {
            createMany: {
              data: opts.input.strictViewGroups.map((groupId) => ({ groupId })),
            },
          },
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

      return newQuiz;
    }),
});
