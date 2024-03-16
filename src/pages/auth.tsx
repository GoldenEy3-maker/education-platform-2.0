import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar } from "~/components/avatar";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const formSchema = z.object({
  login: z.string().min(4, "Обязательное поле!"),
  password: z.string().min(8, "Пароль должен быть не менее 8 символов!"),
});

type FormSchema = z.infer<typeof formSchema>;

const AuthPage: NextPageWithLayout = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = (values: FormSchema) => {
    console.log(values);
  };

  return (
    <main className="auth-bg flex min-h-svh flex-col items-center justify-center px-2">
      <h2 className="mb-5 text-center text-xl font-medium [text-wrap:balance] sm:mb-8 sm:text-2xl">
        Образовательный портал АГУ
      </h2>
      <div className="flex overflow-hidden rounded-lg shadow-sm">
        <div className="items-center justify-center bg-background px-6 py-6 sm:px-10 sm:py-8">
          <div className="md:w-80">
            <h3 className="mb-1 text-center text-xl font-medium">
              Авторизация
            </h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Введите свой корпоративный логин и пароль от учетной записи АГУ
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="login"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Логин</FormLabel>
                      <FormControl>
                        <Input placeholder="ivanov.101s1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-4">
                  <Button asChild variant="link">
                    <Link href="#">Забыли пароль?</Link>
                  </Button>
                  <Button variant="default">Войти</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="hidden flex-col items-center justify-center bg-background/35 px-3 py-8 backdrop-blur md:flex">
          <div className="flex w-80 flex-col items-center text-center">
            <q>
              Наш образовательный портал позволяет нам двигаться в ногу со
              временем, преодолевая все препятствия на пути
            </q>
            <Avatar src={undefined} fallback="ИИ" className="mb-3 mt-9" />
            <p className="text-sm font-medium">Иванов Иван</p>
            <span className="text-sm text-muted-foreground">Студент</span>
          </div>
        </div>
      </div>
    </main>
  );
};

AuthPage.getLayout = (page) => (
  <ScaffoldLayout title="Авторизация">{page}</ScaffoldLayout>
);

export default AuthPage;
