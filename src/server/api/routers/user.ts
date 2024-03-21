import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  singUp: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string(),
        name: z.string(),
        surname: z.string(),
        fathername: z.string().optional(),
        email: z.string().optional(),
        image: z.string().optional(),
        role: z.nativeEnum(Role),
      }),
    )
    .mutation(async (opts) => {
      const newUser = await opts.ctx.db.user.create({
        data: {
          ...opts.input,
          password: await bcrypt.hash(opts.input.password, 12),
        },
      });

      return newUser;
    }),
});
