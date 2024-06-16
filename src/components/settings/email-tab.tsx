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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const formSchema = z.object({
  new: z.string().email().min(1, "Обязательное поле!"),
  code: z.string().min(6, "Код подтверждения состоит минимум из 6 символов!"),
});

type FormSchema = z.infer<typeof formSchema>;

export const EmailTab: React.FC = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new: "",
      code: "",
    },
  });

  // const updatePasswordMutation = api.user.updatePassword.useMutation({
  //   onSuccess: () => {
  //     toast.success("Пароль успешно обновлен!");
  //     form.reset();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  const onSubmit = (values: FormSchema) => {
    // updatePasswordMutation.mutate({
    //   current: values.current,
    //   new: values.new,
    // });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-medium">Email-адрес</h2>
      <p className="text-muted-foreground">
        Вы можете изменить или привязать email, если у вас есть к нему доступ.
      </p>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="new"
            // disabled={updatePasswordMutation.isLoading}
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel className="row-span-2">Новый email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ivanov@mail.ru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            // disabled={updatePasswordMutation.isLoading}
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel className="row-span-2">Код подтверждения</FormLabel>
                <FormControl>
                  <InputOTP
                    autoFocus
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    // onComplete={async () => {
                    //   setIsCodeValidating(true);
                    //   await validateCode(form.getValues("code"));
                    //   setIsCodeValidating(false);
                    // }}
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
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
              // disabled={updatePasswordMutation.isLoading}
            >
              Отменить
            </Button>
            <Button type="submit">
              {/* {updatePasswordMutation.isLoading ? (
                <CircularProgress
                  variant="indeterminate"
                  className="mr-2 text-lg"
                  strokeWidth={5}
                />
              ) : null} */}
              Сохранить
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
