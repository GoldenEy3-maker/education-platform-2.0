import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { PagePathMap } from "~/libs/enums";
import { api } from "~/libs/api";
import { toast } from "sonner";
import { CircularProgress } from "../circular-progress";

const formSchema = z
  .object({
    current: z.string().min(1, "Обязательное поле!"),
    new: z.string().min(8, "Пароль должен быть не мнее 8 символов!"),
    confirm: z.string().min(1, "Обязательное поле!"),
  })
  .refine(
    (values) => {
      return values.new === values.confirm;
    },
    {
      message: "Пароли не совпадают!",
      path: ["confirm"],
    },
  );

type FormSchema = z.infer<typeof formSchema>;

export const ChangePasswordTab: React.FC = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const updatePasswordMutation = api.user.updatePassword.useMutation({
    onSuccess: () => {
      toast.success("Пароль успешно обновлен!");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: FormSchema) => {
    updatePasswordMutation.mutate({
      current: values.current,
      new: values.new,
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-medium">Изменить пароль</h2>
      <p className="text-muted-foreground">
        Вам необходимо знать свой текущий пароль, чтобы его можно было изменить.
        <br />
        Если вы хотите восставноить пароль, тогда перейдите на страницу{" "}
        <Link href={PagePathMap.ResetPassword} className="text-primary">
          Восставление пароля
        </Link>
        .
      </p>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current"
            disabled={updatePasswordMutation.isLoading}
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel className="row-span-2">Текущий пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new"
            disabled={updatePasswordMutation.isLoading}
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel className="row-span-2">Новый пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            disabled={updatePasswordMutation.isLoading}
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel className="row-span-2">
                  Подтверждение пароля
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <footer className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              disabled={updatePasswordMutation.isLoading}
            >
              Отменить
            </Button>
            <Button type="submit" disabled={updatePasswordMutation.isLoading}>
              {updatePasswordMutation.isLoading ? (
                <CircularProgress
                  variant="indeterminate"
                  className="mr-2 text-lg"
                  strokeWidth={5}
                />
              ) : null}
              Изменить пароль
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
