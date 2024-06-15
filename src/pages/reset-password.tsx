import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Avatar } from "~/components/avatar";
import { CircularProgress } from "~/components/circular-progress";
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
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "./_app";
import { Step, Stepper, useStepper } from "~/components/stepper";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";
import { useInterval, useMediaQuery } from "usehooks-ts";
import { api } from "~/libs/api";
import { create } from "zustand";
import FlipNumbers from "react-flip-numbers";

type ResetPasswordStore = {
  id: string;
  login: string;
  code: string;
  setId: (value: string) => void;
  setLogin: (value: string) => void;
  setCode: (value: string) => void;
  reset: () => void;
};

const useResetPasswordStore = create<ResetPasswordStore>((set) => ({
  id: "",
  login: "",
  code: "",
  setId: (value) => set({ id: value }),
  setLogin: (value) => set({ login: value }),
  setCode: (value) => set({ code: value }),
  reset: () => set({ id: "", code: "", login: "" }),
}));

const loginFormSchema = z.object({
  login: z.string().min(1, "Обязательное поле!"),
});

const codeFormSchema = z.object({
  code: z
    .string()
    .min(6, "Код восставновления всегда состоит минимум из 6 символов!"),
});

const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, "Пароль должен быть миниму 8 символов!"),
    confirmPassword: z.string().min(1, "Обязательное поле!"),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: "Пароли не совпадают!",
    path: ["confirmPassword"],
  });

type LoginFormSchema = z.infer<typeof loginFormSchema>;
type CodeFormSchema = z.infer<typeof codeFormSchema>;
type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

const LoginForm: React.FC = () => {
  const resetPasswordStore = useResetPasswordStore();
  const { nextStep } = useStepper();

  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      login: resetPasswordStore.login,
    },
  });

  const sendMailMutation = api.mailer.resetPassword.useMutation({
    onSuccess: (data) => {
      nextStep();
      toast.success("Сообщение успешно отправлено!");
      resetPasswordStore.setId(data.id);
      resetPasswordStore.setCode(data.code);
      resetPasswordStore.setLogin(data.login);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: LoginFormSchema) => {
    sendMailMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="login"
          disabled={sendMailMutation.isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Логин</FormLabel>
              <FormControl>
                <Input placeholder="ivanon.105s1" {...field} />
              </FormControl>
              <FormDescription>
                Если письмо долго не приходить, проверьте папку спам, или
                обратитесь в тех. отдел.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex flex-wrap items-center justify-between gap-2">
          <Button asChild variant="link">
            <Link href={PagePathMap.Auth}>Авторизация</Link>
          </Button>
          <Button disabled={sendMailMutation.isLoading}>
            {sendMailMutation.isLoading ? (
              <CircularProgress
                variant="indeterminate"
                className="mr-2 text-xl"
                strokeWidth={5}
              />
            ) : null}
            Дальше
          </Button>
        </footer>
      </form>
    </Form>
  );
};

const CodeForm: React.FC = () => {
  const resetPasswordStore = useResetPasswordStore();
  const { nextStep, prevStep } = useStepper();
  const isXsMobile = useMediaQuery("(max-width: 425px)");

  const [timer, setTimer] = useState(59);
  const [isCodeValidating, setIsCodeValidating] = useState(false);

  const form = useForm<CodeFormSchema>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const resendMailMutation = api.mailer.resetPassword.useMutation({
    onSuccess: (data) => {
      toast.success("Сообщение успешно отправлено!");
      resetPasswordStore.setCode(data.code);
      setTimer(59);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const validateCode = (code: string) => {
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        if (code === resetPasswordStore.code) {
          nextStep();
        } else {
          form.setError("code", {
            message: "Неверный код подтверждения!",
          });
        }

        resolve();
      }, 1000),
    );
  };

  const onSubmit = async (values: CodeFormSchema) => {
    await validateCode(values.code);
  };

  const isLoading =
    resendMailMutation.isLoading ||
    form.formState.isSubmitting ||
    isCodeValidating;

  useInterval(() => setTimer((prev) => prev - 1), timer > 0 ? 1000 : null);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="code"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код подтверждения</FormLabel>
              <FormControl>
                <InputOTP
                  autoFocus
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  onComplete={async () => {
                    setIsCodeValidating(true);
                    await validateCode(form.getValues("code"));
                    setIsCodeValidating(false);
                  }}
                  {...field}
                >
                  {isXsMobile ? (
                    <>
                      <InputOTPGroup className="w-full justify-center">
                        <InputOTPSlot className="h-9 w-9" index={0} />
                        <InputOTPSlot className="h-9 w-9" index={1} />
                        <InputOTPSlot className="h-9 w-9" index={2} />
                        <InputOTPSlot className="h-9 w-9" index={3} />
                        <InputOTPSlot className="h-9 w-9" index={4} />
                        <InputOTPSlot className="h-9 w-9" index={5} />
                      </InputOTPGroup>
                    </>
                  ) : (
                    <div className="flex w-full items-center justify-center">
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
                    </div>
                  )}
                </InputOTP>
              </FormControl>
              <FormDescription>
                {timer > 0 ? (
                  <div className="flex flex-wrap items-center">
                    Отправить повторно код через:&nbsp;
                    <FlipNumbers
                      width={9}
                      height={14}
                      color=""
                      play
                      numbers={timer.toString()}
                    />
                    &nbsp;сек.
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    disabled={isLoading}
                    onClick={() =>
                      resendMailMutation.mutate({
                        login: resetPasswordStore.login,
                      })
                    }
                  >
                    {isLoading ? (
                      <CircularProgress
                        variant="indeterminate"
                        className="mr-2 text-xl"
                        strokeWidth={5}
                      />
                    ) : null}
                    Отправить код еще раз
                  </Button>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="link"
            disabled={isLoading}
            onClick={prevStep}
          >
            <TbArrowLeft className="mr-2 text-lg" />
            <span>Назад</span>
          </Button>
          <Button disabled={isLoading}>Дальше</Button>
        </footer>
      </form>
    </Form>
  );
};

const ResetPasswordForm: React.FC = () => {
  const resetPasswordStore = useResetPasswordStore();
  const { nextStep } = useStepper();

  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = api.user.resetPassword.useMutation({
    onSuccess: () => {
      toast.success("Пароль успешно обновлен!");
      resetPasswordStore.reset();
      nextStep();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: ResetPasswordFormSchema) => {
    resetPasswordMutation.mutate({
      id: resetPasswordStore.id,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          disabled={resetPasswordMutation.isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Новый пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          disabled={resetPasswordMutation.isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Повторите пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex flex-wrap items-center justify-end gap-2">
          <Button disabled={resetPasswordMutation.isLoading}>
            {resetPasswordMutation.isLoading ? (
              <CircularProgress
                variant="indeterminate"
                className="mr-2 text-xl"
                strokeWidth={5}
              />
            ) : null}
            Отправить
          </Button>
        </footer>
      </form>
    </Form>
  );
};

const StepperActions: React.FC = () => {
  const { hasCompletedAllSteps } = useStepper();

  if (!hasCompletedAllSteps) return null;

  return (
    <div className="text-center">
      <p>Супер! Теперь вы можете войти в свой аккаунт под новым паролем! 🎉</p>
      <Button asChild variant="link" className="mt-1">
        <Link href={PagePathMap.Auth}>
          Авторизоваться <TbArrowRight className="ml-2" />
        </Link>
      </Button>
    </div>
  );
};

const steps = [{ label: "Логин" }, { label: "Код" }, { label: "Смена пароля" }];

const ResetPasswordPage: NextPageWithLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[radial-gradient(circle_at_bottom_left,rgb(250,232,2261)_10%,rgb(249,225,238)_30%,rgb(216,232,252)_50%,transparent_100%),radial-gradient(circle_at_bottom_right,rgb(115,234,236)_10%,rgb(170,202,244)_30%,rgba(216,232,252,1)_50%,transparent_100%)] bg-fixed px-2 py-3 dark:bg-[radial-gradient(circle_at_bottom_left,#6820b2_15%,#3760a1_40%,#4d68b6_60%,transparent_100%),radial-gradient(circle_at_bottom_right,#5a2492_20%,#3668b9_40%,#3258c5_60%,transparent_100%)]">
      <div className="mb-5 flex flex-col items-center justify-center gap-2 sm:mb-7">
        <span className="block text-8xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 120 105"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.447 71.88s3.06 4.742 9.53 6.3C35.03 80.843 51.087 77.111 58.56 91l.01-.02c.52.963 1.064 2.091 1.282 2.96.07-.923-.156-2.395-.632-4.084 7.725-12.535 23.185-9.088 33.924-11.675 6.47-1.559 9.53-6.301 9.53-6.301-.005.516-.049 1.018-.048 1.508.058 19.494-15.71 18.065-22.29 18.986-10.287 1.442-18.417 6.624-21.762 12.57l-.014.026-.013-.026c-3.346-5.946-11.266-11.35-21.762-12.57-7.146-.83-22.338-.171-22.327-19.884 0-.201-.01-.405-.011-.61z"
              fill="#1E4F9B"
            />
            <path
              d="M64.326 60.263l-.116-.005.045.547.005-.033c.024-.148.047-.327.066-.509zm-1.34.128l.003-.077-.177.022a14.22 14.22 0 01-.638 3.785c-.659 2.091-1.983 4.487-4.638 6.07a15.663 15.663 0 01-3.424 1.541c-1.035.323-1.974.5-2.873.668-1.14.215-2.217.417-3.305.865a9.886 9.886 0 00-2.389 1.416l.019-.001-.033.226a9.916 9.916 0 012.516-1.505c1.084-.443 2.126-.638 3.229-.846l.046-.008c1.81-.341 3.784-.72 6.312-2.228 1.29-.77 2.27-1.728 3.012-2.747a11.718 11.718 0 001.603-3.149l.037-.108.015-.014c.14-.42.249-.826.334-1.205.08-.347.14-.674.185-.965l.057-.442c.07-.53.098-.975.11-1.298zm1.446-3.507l-.059.2v1.44s.011.116.011.315l.145-.001c.118-.277.294-.827.26-1.587a6.681 6.681 0 00-.33-1.707c.02.114.034.229.044.341.032.358.015.702-.07.999zm-1.279-1.737c-.11-.006-.221-.011-.324-.014.181.45.398 1.168.424 2.01a5.346 5.346 0 01-.223 1.72c.115-.013.235-.025.356-.034.029-.087.051-.18.075-.281.005-.005.135-.55.145-.592l-.047-1.179a3.936 3.936 0 00-.134-.932 4.267 4.267 0 00-.272-.698zM51.935 67.485c-1.137.174-2.144.602-2.856.978l-.048.21c.705-.387 1.75-.855 2.934-1.036l.325-.042.001-.002.467-.056c.798-.097 1.908-.231 3.134-.478 1.178-.236 2.46-.576 3.663-1.085.084-.11.165-.223.243-.338-1.035.483-2.15.832-3.216 1.089-1.514.364-2.912.541-3.849.655l-.413.05-.385.055zm13.2-12.695c.003.031.019.028.05.115.144.414.447 1.283.493 2.308.05 1.087-.273 1.87-.416 2.16v.003c.137-.002.301-.003.369-.011l.033-.036c.737-1.362.41-3.157-.046-4.25-.181-.115-.351-.208-.483-.29zm-15.943.164s.752.77.74 1.978c-.011 1.21-.46 1.997-.74 2.203.335-1.078.398-3.116 0-4.181zm-.064-.76c.24 0 1.532 1.263 1.532 2.82 0 1.556-1.303 2.817-1.532 2.817-.229 0-1.532-1.261-1.532-2.818 0-1.556 1.292-2.818 1.532-2.818zM47.47 68.408h.002c.212-.156 2.036-1.455 4.33-1.807.277-.038.551-.074.828-.108.924-.112 2.302-.287 3.747-.635 1.438-.346 2.962-.865 4.215-1.67l.783-.505c.561-1.87.558-3.434.55-3.76-.002-.142-.036-.476-.013-.597l.106-.28c.65-1.524.337-3.013-.292-4.477.183-.088.32-.189.518-.255.17-.677.823-1.175 1.46-1.396a5.612 5.612 0 01-1.617-.817l-1.43-.618c-.94-.405-1.707-1.428-2.087-2.357-.735-.647-1.389-1.114-1.772-2.091l-.044-.112-.55.135c.225 2.224 1.34 4.5 1.343 4.507.403.83.43.963 1.462 1.313 2.683.91 3.645 3.948 2.457 6.268l-2.59.114-.38.837a1.928 1.928 0 01-.182.202c-.36.143-1.07.338-1.326.404-.304.317-1.4.544-2.152.037-.23-.154-.388-.361-.437-.622l-.074.006.014-.606a265.63 265.63 0 00-4.274.325c.308-.15 1.358-1.366 1.358-2.843 0-1.401-.936-2.566-1.301-2.811 1.012.136 1.977.257 2.906.364-.007-.727.674-1.441 1.104-1.542.02-.005-.955-.148-1.769-.854-1.346-.307-2.447-1.347-2.526-1.391-.27.383-.393 1.016-1.074 1.969-.706 1.122-1.529 2.404-2.245 3.152a7.844 7.844 0 01-.38.352c-.062.048-.112.09-.153.127-.88.714-1.83 1.099-2.825.938l-1.21-.197.6-.647c-.708.68-1.44 1.324-2.175 1.885-2.198 1.678-4.455 2.637-6.295 1.76l-1.076-.514 1.01-.636c.517-.326.997-.727 1.467-1.038-2.002 1.137-3.704 1.68-4.845 1.926-2.238.482-3.174.32-4.533-1.344l.878-.393c1.85-.832 3.639-1.67 5.424-2.594-3.153 1.266-8.017 2.628-9.06-.684l-.231-.709.73-.14c.017-.002 5.824-1.12 11.045-3.455-1.792.753-5.596 2.191-7.413.628l-.001.002a2.132 2.132 0 01-.356-.386l-.515-.719.835-.286c2.529-.868 5.202-1.863 8.626-3.49a98.073 98.073 0 003.469-1.736l1.634-1.978a66.804 66.804 0 014.407-4.813 6.058 6.058 0 01-1.757.766c-.73.183-1.463.203-2.127.032a3.04 3.04 0 01-1.753-1.188l-.452-.633a6.99 6.99 0 01-1.973.531c-1.035.116-2.018-.033-2.766-.439-.605-.328-1.06-.819-1.287-1.468l-.211-.607c-.479.237-.966.433-1.452.588-1.035.33-2.072.474-3.017.436-.982-.04-1.876-.277-2.585-.71-.705-.43-1.227-1.047-1.482-1.851l-.199-.628c-1.204.24-2.384.281-3.435.148-1.186-.15-2.22-.527-2.959-1.094-.603-.463-1.018-1.052-1.178-1.754L16.7 28.81a8.289 8.289 0 01-2.276-.641c-1.29-.566-2.588-1.502-3.33-2.851a4.998 4.998 0 01-.557-1.625l-.01-.064v-.96c-.863-.429-1.677-.99-2.358-1.708-.106-.111-.21-.215-.318-.325-.9-.906-2.122-2.138-2.288-4.212v-.01a.74.74 0 010-.148l.066-.621a12.61 12.61 0 01-2.264-1.77C1.519 12.047-.14 9.21.009 4.94l.066-1.894c.385.526.779 1.051 1.156 1.58C2.773 6.685 5.704 8.92 9.133 10.96c-.93-.805-2.097-2.054-2.965-3.67-.844-1.571-1.422-3.497-1.262-5.714L5.02 0l1.16 1.335.009.05c.1.152.208.305.324.46l-.001.002c.132.176.277.358.434.542l.136.142c.22.228.435.451.62.67 7.356 7.255 26.563 10.055 36.035 11.435l.606.088c2.398.347 2.716.393 4.863 2.239l.583.5c4.775 4.107 5.331 4.585 10.044 6.8l3.596-2.24c.167-.104.343-.216.515-.331.166-.11.341-.234.522-.37 1.005-.75 2.052-1.64 2.664-2.16.156-.133.282-.24.43-.362.78-.642 1.44-1.217 1.969-1.679.993-.866 1.53-1.335 2.283-1.675.861-.387 1.865-.528 4.051-.835l1.473-.21c5.163-.746 9.376-1.558 12.838-2.351 10.63-2.529 18.57-6.044 22.589-10.6l.015-.107L113.944 0l.114 1.577c.161 2.217-.417 4.143-1.261 5.715-.759 1.412-1.747 2.545-2.605 3.345 3.371-1.836 6.3-3.987 7.815-6.01.261-.463.822-1.123 1.156-1.58l.066 1.894c.148 4.27-1.51 7.106-3.355 8.933a12.483 12.483 0 01-1.851 1.505c.637 3.16-3.038 6.375-6.226 7.336l-.71 1.156c-.402 1.422-1.56 2.51-3.116 3.16-1.045.437-2.104.564-2.634.425-.228-.06-.402-.179-.603-.296a16.65 16.65 0 01-1.22.082l-.368 1.245c-.193.652-.618 1.165-1.208 1.549-.861.559-2.092.835-3.457.86-.452.009-.92-.01-1.396-.055l-.413 1.16c-.188.528-.563.963-1.075 1.294v-.002c-.695.45-1.658.709-2.734.743a9.205 9.205 0 01-3.34-.546 9.75 9.75 0 01-.83-.342l-.29.998c-.72 2.495-5.205 2.218-6.7.515l-.908.912c-.636.637-1.522.937-2.44.96a4.918 4.918 0 01-2.739-.763l-.338-.22c-.966 1.591-3.778 4.816-5.878 6.434l-.001 1.675c-.003 1.358.707 6.428 1.376 7.743.472.928.222.997 1.631 1.476 1.104.374 1.958.873 2.47 1.827 1.55-.147 3.451-.327 5.205-.54.681.695 1.177 1.55 1.205 2.863.028 1.313-.566 2.576-1.057 2.846-3.701-.294-5.565-.507-8.097-.62-.075.21-.21.48-.44.808l-.002.001c-.058.072-.12.139-.185.198-.29.269-.643.413-1.004.377l-.111-.012-.053-.025a1.417 1.417 0 01-.633.255 2.84 2.84 0 01-.557.008l-.008.048a6.595 6.595 0 01-1.116 2.79l-1.178 1.686a12.366 12.366 0 01-1.48 2.708 10.954 10.954 0 01-3.278 2.992c-2.682 1.6-4.749 1.989-6.647 2.346l-.047.008c-1.037.195-2.019.383-3.011.788-.997.407-2.022 1.041-3.158 2.14l-.936.905.226-1.568-1.612.194.957-.925c1.343-1.298 2.556-2.05 3.737-2.537 1.176-.483 2.295-.694 3.479-.916.876-.165 1.79-.337 2.776-.645.979-.304 2.04-.746 3.23-1.456a9.064 9.064 0 002.812-2.62c-1.265.535-2.602.89-3.827 1.135-1.25.251-2.387.389-3.204.488l-.466.056-.299.04c-1.929.296-3.442 1.434-3.47 1.454l-.018.016-.93.621.308-1.362-1.585-.13 1.067-.713z"
              fill="#1E4F9B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M98.518 28.354c-.978 3.3-10.216 2.142-12.628-1.59 3.598 2.108 11.162 2.111 12.628 1.59zm-6.464 3.48c-.871 2.446-7.578 2.37-10.518-2.189 3.264 2.688 9.21 2.626 10.518 2.188zm-8.279 2.183c-.515 1.778-5.489 1.844-6.853-1.364 1.941 1.451 5.925 1.603 6.853 1.364zm-7.444 1.145c-1.06 1.064-3.069.95-4.358.11.284-.383.45-.625.689-.987 1.208.687 2.649.913 3.669.877zm14.445-20.321c-4.167 1.447-8.78 2.538-12.312 3.68-2.515.812-3.16 1.417-5.945 3.859-1.525-.536-3.536-.641-4.343-.578-1.382.11-2.871.403-4.4.831.335-.209.719-.457 1.083-.73 1.306-.977 2.7-2.2 3.117-2.544 4.674-3.844 2.828-3.297 9.453-4.255 10.362-1.498 16.926-3.26 21.264-4.615-2.214 1.686-5.114 3.23-7.917 4.352zm-75.31 12.026c.831.66 1.863 1.07 2.544 1.25-1.04.574-6.227-.722-6.827-4.475h.003c3.82 1.324 7.718 3.415 16.353 2.138-3.854 1.713-8.606 2.12-12.072 1.087zm2.115 2.915c.753 3.306 9.156 3.655 13.294-1.764-3.966 2.72-11.76 2.38-13.294 1.764zm7.756 3.274c1.086 3.431 8.415 2.7 11.494-2.37-3.57 2.93-10.067 2.851-11.494 2.37zm8.741 2.127c.93 2.67 7.274 1.843 8.669-2.944-2.432 2.719-7.444 3.19-8.669 2.944zm6.393 1.844c1.635 2.29 6.223.512 7.1-2.906-2.382 2.36-6.094 3.026-7.1 2.906zm2.779-8.846c-.753.712.481 1.772 2.937 1.445 0 0-1.95-.438-2.938-1.445zm-5.43-3.667c-.936.885.6 2.204 3.651 1.797 0 0-2.422-.544-3.65-1.797zm-5.47-4.485c-1.254 1.047.585 2.839 4.483 2.566 0 0-3.025-.882-4.482-2.566zm70.675 6.062a5.909 5.909 0 01-1.659.73c.69.402 4.425-.508 5.11-3.145l-.007.003.018-.028c-3.926.968-8.457 2.234-17.599.5 4.158 2.326 10.186 3.164 14.137 1.94zm6.018-6.313c-2.035 1.546-4.748 2.409-6.32 2.728 2.029.318 5.594.047 7.9-1.976.897-.787 2.442-1.831 2.796-3.909a.08.08 0 00.004-.023l-.286.138c-1.532.662-9.072 3.406-19.182 3.388 7.006 1.861 11.939.995 15.088-.346zm9.43-14.389zm.071-.332l.031-.043c.282 8.09-6.249 10.711-7.379 11.15 1.482-1.283 2.806-2.64 4.025-5.228-2.863 2.872-8.125 5.582-17.726 4.911 6.763-.77 17.512-6.067 21.038-10.777l.005-.006.005-.007h.001zm-7.83 1.242c-4.276 4.11-12.78 8.12-19.104 9.32 4.186-1.463 8.938-4.028 11.459-6.705 4.253-1.895 7.498-3.565 10.302-7.124a.505.505 0 00.03-.11l.004-.004c.407 5.628-4.278 9.27-5.227 9.732l-.086.033s1.358-1.877 2.622-5.142zM68.928 25.4s2.754.129 3.13 1.576c0 0-.147.003-.378-.034 0 0-.158.748-.92.903-1.284.117-1.8-1.138-1.473-1.991 0 0-.22-.243-.36-.454zm1.415 1.141s-.144.683.337.789c.419.09.643-.267.575-.514 0 0-.163.308-.502.242-.373-.071-.41-.517-.41-.517zm3.905 1.66a.309.309 0 01-.409-.36c.174-.185.571.092.41.36zM43.262 56.707c2.518-2.716 3.894-4.697 5.216-6.942.257.274.525.539.795.792-1.448 2.976-3.689 6.527-6.01 6.15zm-8.9 2.855c6.218-3.92 8.762-6.648 13.078-11.048.161.226.335.45.518.667-1.063 1.48-9.165 12.496-13.596 10.381zm-7.115-.806c6.355-2.855 11.98-5.793 19.282-11.967.118.358.282.714.483 1.063-3.073 2.625-8.892 7.654-11.13 9.046-2.829 1.76-7.081 3.384-8.635 1.858zm19.186-14.689c-1.75 1.331-6.3 4.881-11.278 7.108-5.294 2.368-11.188 3.502-11.188 3.502s.718 2.408 5.332 1.084c4.125-1.185 9.19-3.924 17.006-10.175a5.579 5.579 0 01.128-1.519zm3.16-4.495c-11.167 6.853-16.848 9.116-21.944 10.864 2.352 3.285 17.114-5.107 21.944-10.864zm10.511 6.06c-.401.843-.534 3.449.811 5.298-1.64-.708-3.18-4.205-.81-5.298zm1.292 2.363c.17 2.131 1.566 3.537 2.53 4.355-1.684-.48-4.05-2.592-2.53-4.355zm3.35-4.981s-3.162 1.279-3.04 4.309c.431-.491 1.28-1.232 2.114-1.256-.948.637-1.46 1.759-1.237 3.043 0 0 1.12-1.393 1.51-1.24 0 0-1.131 1.42-.497 3.048 0 0 .24-.608.94-.695-.28.6-.27 1.515-.091 2.046 0 0 1.011-.109 1.746-.516-1.578-3.098-1.442-5.604-1.444-8.74zm-3.283-5.516s2.69.497 5.202-1.035c-1.462.035-2.25-.172-2.735-.828 5.029-.945 6.477-2.24 8.468-4.56a.235.235 0 01.03-.031l.004-.003.003-.002.059-.054.002-.002c.8-.68 1.699-.037 1.702.453-.334.278-.817.305-1.242.1-1.742 4.275-9.704 13.178-16.494 14.835l.095-.762a25.09 25.09 0 003.58-2.071c-.544-.308-.858-.621-1.117-1.067.57.033 1.926-.114 3.718-1.072-.993-.173-2.156-.73-2.511-1.393 1.562.14 3.038-.284 4.434-.765-1.398-.032-2.589-1.03-3.198-1.743zM49.718 41.67c-.78 1.065-1.391 2.985-.61 6.584-1.419-1.257-2.7-5.713.61-6.584zm1.053 3.752c-.402.887-.534 3.628.81 5.573-1.64-.745-3.18-4.424-.81-5.573zm1.383 2.792c.12 1.973 1.534 3.485 2.526 4.327-1.733-.494-4.09-2.512-2.526-4.327zm6.009-1.657c.054.59.122.914.278 1.632-.399-.354-.755-.633-1.033-1.342.25-.089.502-.186.755-.29zm-2.182-5.113l.182-1.646s-2.194 1.169-2.222 2.792c0 0 .878-.954 2.04-1.146zm-.284 2.784l.253-1.874s-2.682.483-2.854 3.798c.6-1.148 1.727-1.737 2.602-1.924zm1.26 7.675s-1.81-3.696-1.379-6.464c-1.39.55-2.515 1.802-2.229 3.514 0 0 1.12-1.245 1.51-1.087 0 0-1.13 1.477-.497 3.169 0 0 .24-.633.94-.723-.28.624-.27 1.574-.09 2.127 0 0 1.01-.113 1.745-.536zm9.355 8.194c.027-.038.07-.139-.014-.36zm1.141-2.754c-.125.55-.579.895-.579.895.437-.17.714-.497.864-.824a.262.262 0 00.14-.084c.847-.99-.52-2.532-1.189-2.958.805.326 1.217.798 1.685 1.447.162.295.31.66.272.975-.047.381.103.588.277.653-.085.407-.435.751-.435.751.433-.185.639-.481.74-.788a.287.287 0 00.034-.03c.269-.278.166-.69.151-.958-.052-.978-.917-1.818-1.52-2.162 1.047.393 1.901 1.08 1.917 2.317.005.387.16.577.328.627-.081.47-.4.83-.4.83.37-.208.582-.55.694-.881a.318.318 0 00.05-.047c.49-.574-.101-2.023-.562-2.564-1.015-1.192-2.665-.826-3.416-2.092-.73.356-1.698.535-1.713.498.022.055-.521.547-.521.547-.762.159-1.067.504-1.084.615l1.958.237c.728.456 1.279.708 1.762 1.289l.003.005c.078.098.43.475.354 1.104-.037.3.06.498.19.598zm-9.366.022c-.1.592-.594.967-.594.967.49-.192.778-.579.913-.942a.251.251 0 00.075-.06c.846-.99-.52-2.532-1.189-2.958.804.326 1.217.798 1.685 1.447.162.295.31.66.271.975-.049.403.122.611.307.662-.049.444-.448.835-.448.835.503-.215.7-.58.78-.936.24-.276.143-.672.129-.933-.053-.978-.918-1.818-1.52-2.162 1.047.393 1.9 1.08 1.916 2.317.005.41.179.598.358.634-.055.512-.412.917-.412.917.427-.242.644-.662.74-1.038.466-.585-.119-2.012-.575-2.548-1.016-1.192-2.665-.826-3.417-2.092-.73.356-1.697.535-1.713.498.021.055-.319.51-.319.51-.761.16-1.243.472-1.285.652l1.958.237c.728.456 1.278.708 1.762 1.289l.003.005c.078.098.43.475.354 1.104-.04.323.075.528.22.62zm-3.045 2.675c.081.013 1.138-.04 1.268-.04.117-.002.227-.018.33-.046.494-.13.844-.5 1.188-.766-.264.532-.428.862-1.009 1.047l-.011.004c-.274.408-1.704.223-1.766-.2zm8.651-.24l.343.002c.236.012.34.027.682.002h.06c-.01.325-.057.74-.105 1.038a6.177 6.177 0 01-1.042 2.605c.154-.724.21-1.264.21-1.46 0-.708-.148-2.187-.148-2.187zm-.286.018c.003.088.028.836-.115 1.93l.008-.02a14.49 14.49 0 01-.638 2.824l-.017.015c-.722 2.135-2.118 4.53-4.81 6.136-2.617 1.56-4.644 1.941-6.504 2.291-2.156.406-4.078.767-6.442 3.053l.124-.853-.872.105c2.597-2.511 4.666-2.9 6.989-3.337 1.775-.334 3.708-.698 6.152-2.155 5.076-3.026 5.077-9.196 5.061-9.895.05.04.592-.058 1.064-.094zm-1.208-4.923s.165-.218.579-.209c.224.005.435.02.632.03l.018.035.018.001c.36.693.516 1.195.56 1.893.106-.51-.008-1.195-.2-1.8l-.021-.112.093.001c.318 0 .64-.044.786.085l.001.01a.274.274 0 01.035.026c.008.129.487 1.158.543 2.413.057 1.256-.42 2.036-.42 2.036-.464.038-.525.01-.891-.003l.002-.035-.038-.001c.014-.202.013-.429.01-.578-.052.217-.097.403-.22.61-.538.009-1.347.175-1.31.094l.007-.015c-.033-.002-.049-.009-.043-.022.995-2.148.031-4.18-.14-4.459zM47.69 68.78c.005-.004 1.822-1.379 4.152-1.737.264-.04.514-.07.812-.106 1.862-.226 5.55-.703 8.15-2.374-.204.639-.575 1.244-.994 1.779-2.532 1.096-5.412 1.444-7.026 1.64a33.03 33.03 0 00-.78.099c-2.053.315-3.666 1.535-3.67 1.539l.175-.772-.819-.067zm17.633-8.939c.243-.01.465-.019.52-.019a1.41 1.41 0 00.455-.084c.43-.154.748-.485 1.064-.729-.267.535-.431.867-1.021 1.051-.008.013-.017.023-.026.034l-.002.002-.001.002c-.176.197-.604.24-1.015.163l.026-.42zM7.675 17.268l.016.02c2.465 1.327 7.954 3.721 16.066 4.453-5.491.93-9.382.361-12.08-.696 1.64 1.11 3.47 1.85 4.653 2.206-2.05.13-5.575-.465-7.687-2.691-.82-.864-2.259-2.043-2.426-4.136a.146.146 0 01-.003-.036l1.461.88zM4.071 11.05c2.925 3.138 8.284 6.358 17.983 6.482C14.604 15.278 4.23 9.78.705 5.07l-.004-.006-.005-.007-.032-.043c-.283 8.09 6.248 10.711 7.379 11.15-1.46-1.264-2.767-2.6-3.972-5.114zm45.322 13.04c-3.893-.222-10.295-1.244-14.513-3.903 4.085.37 7.405.32 10.161.079l-.2-.19c-8.575-1.908-29.174-6.304-36.66-13.961 1.284 3.378 2.693 5.326 2.693 5.326l-.086-.033c-.949-.462-5.634-4.104-5.227-9.732l.004.005v.002c.265.411.563.81.894 1.198.278.291.565.582.77.828 7.567 7.484 27.22 10.29 36.673 11.668 2.556.373 2.776.33 4.879 2.137 5.495 4.723 5.808 5.07 11.097 7.546.096-.058.207-.114.342-.164 2.524-.937 5.053-1.603 7.3-1.78 2.16-.17 6.08.32 7.284 2.785.21.432.346.984.367 1.732.966 1.29 1.475 3.305-.337 4.107.829-1.192-.834-2.845-2.347-1.918-1.776 1.088-3.663 3.864-8.408 4.709.295-.417.45-1.138.497-1.456-1.573.647-4.022.863-5.388.762 0 0 1.744-.842 2.112-1.846-6.272 2.242-14.749 8.4-19.627 11.039 4.65-5.629 9.966-9.922 13.16-12.376-3.244-.334-7.078-1.235-9.878-2.706 2.711.136 6.286.037 9.409-.215l-.01-.008c-4.027-.118-10.622-1.179-14.64-3.323 4.408.285 7.402.05 9.68-.312zm-.227 30.864s.681.629.74 1.978c.058 1.35-.741 2.203-.741 2.203s.372-2.09 0-4.181zM.715 5.157c.018.082.05.208.097.374a1.836 1.836 0 01-.097-.374z"
              fill="#fff"
            />
          </svg>
        </span>
        <h2 className="text-center text-xl font-medium [text-wrap:balance] sm:text-2xl">
          Образовательный портал АГУ
        </h2>
      </div>
      <div className="flex overflow-hidden rounded-lg shadow-sm">
        <div className="items-center justify-center bg-background px-6 py-6 sm:px-10 sm:py-8">
          <div className="md:w-80">
            <h3 className="mb-1 text-center text-xl font-medium">
              Восстановление пароля
            </h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Для восстановления пароля требуется иметь привязанный email адрес
              на аккаунте.
            </p>
            <div className="space-y-4">
              <Stepper variant="circle-alt" initialStep={0} steps={steps}>
                {steps.map((step, index) => {
                  if (index === 0) {
                    return (
                      <Step key={step.label}>
                        <LoginForm />
                      </Step>
                    );
                  }

                  if (index === 1) {
                    return (
                      <Step key={step.label}>
                        <CodeForm />
                      </Step>
                    );
                  }

                  return (
                    <Step key={step.label}>
                      <ResetPasswordForm />
                    </Step>
                  );
                })}
                <StepperActions />
              </Stepper>
            </div>
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

ResetPasswordPage.getLayout = (page) => (
  <ScaffoldLayout title="Восстановление пароля">{page}</ScaffoldLayout>
);

export default ResetPasswordPage;
