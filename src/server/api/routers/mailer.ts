import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { transporter } from "~/server/nodemailer";
import crypto from "crypto";

export const mailerRouter = createTRPCRouter({
  resetPassword: publicProcedure
    .input(z.object({ login: z.string() }))
    .mutation(async (opts) => {
      const user = await opts.ctx.db.user.findUnique({
        where: {
          login: opts.input.login,
        },
      });

      if (!user) throw new Error("Такого пользователя не существует!");
      if (!user.email) throw new Error("Email не привязан!");

      const code = crypto.randomBytes(3).toString("hex");

      await transporter.sendMail({
        from: "АГУ Платформа",
        to: user.email,
        subject: "Смена пароля",
        text: "Ваш код подтверждения смены пароля: " + code,
      });

      return {
        code,
        login: user.login,
        id: user.id,
      };
    }),
});
