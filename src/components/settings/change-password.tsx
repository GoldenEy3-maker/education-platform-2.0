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

export const ChangePassword: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-medium">Изменить пароль</h2>
      <p className="text-muted-foreground">
        Вам необходимо знать свой текущий пароль, чтобы его можно было изменить.
      </p>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="current"
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
            >
              Отменить
            </Button>
            <Button type="submit">Изменить пароль</Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
