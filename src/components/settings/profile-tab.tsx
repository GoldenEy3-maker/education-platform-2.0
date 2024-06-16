import { z } from "zod";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CircularProgress } from "../circular-progress";
import { handleFileName, uploadFiles } from "~/libs/utils";
import { UploadThingError } from "uploadthing/server";
import { api } from "~/libs/api";
import { toast } from "sonner";
import { type ClientUploadedFileData } from "uploadthing/types";

const formSchema = z.object({
  bgImage: z.array(z.custom<File>()),
  avatar: z.array(z.custom<File>()),
  surname: z.string().optional(),
  name: z.string().optional(),
  fathername: z.string().optional(),
  group: z.string().optional(),
  status: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

type ProfileTabProps = {
  onBgSelect: (files: FileList | null) => void;
  onAvatarSelect: (files: FileList | null) => void;
  onCancel: () => void;
};

export const ProfileTab: React.FC<ProfileTabProps> = ({
  onAvatarSelect,
  onBgSelect,
  onCancel,
}) => {
  const { data: session } = useSession();

  const [bgImageLoadingProgress, setBgImageLoadingProgress] = useState<
    boolean | number
  >(false);
  const [avatarLoadingProgress, setAvatarLoadingProgress] = useState<
    boolean | number
  >(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bgImage: [],
      avatar: [],
      surname: "",
      name: "",
      fathername: "",
      group: "",
      status: "",
    },
  });

  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Данные профиля успешно обновлены!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: FormSchema) => {
    let uploadedBgImage: ClientUploadedFileData<{
      name: string;
      size: number;
      type: string;
      customId: string | null;
      key: string;
      url: string;
    }>[] = [];
    let uploadedAvatar: ClientUploadedFileData<{
      name: string;
      size: number;
      type: string;
      customId: string | null;
      key: string;
      url: string;
    }>[] = [];

    if (values.bgImage.length > 0) {
      try {
        uploadedBgImage = await uploadFiles("image", {
          files: values.bgImage.map((file) => {
            const [, ext] = handleFileName(file.name);

            return new File([file], crypto.randomUUID() + "." + ext, {
              type: file.type,
            });
          }),
          onUploadBegin: () => setBgImageLoadingProgress(0),
          onUploadProgress: (opts) => setBgImageLoadingProgress(opts.progress),
        });

        setBgImageLoadingProgress(true);
      } catch (error) {
        if (error instanceof UploadThingError) {
          form.setError("bgImage", { message: error.message });
        } else {
          form.setError("bgImage", {
            message:
              "Возникла неожиданная ошибка во время загрузки изображения! Повторите попытку позже.",
          });
        }

        setBgImageLoadingProgress(false);

        return;
      }
    }

    if (values.avatar.length > 0) {
      try {
        uploadedAvatar = await uploadFiles("image", {
          files: values.avatar.map((file) => {
            const [, ext] = handleFileName(file.name);

            return new File([file], crypto.randomUUID() + "." + ext, {
              type: file.type,
            });
          }),
          onUploadBegin: () => setAvatarLoadingProgress(0),
          onUploadProgress: (opts) => setAvatarLoadingProgress(opts.progress),
        });

        setAvatarLoadingProgress(true);
      } catch (error) {
        if (error instanceof UploadThingError) {
          form.setError("bgImage", { message: error.message });
        } else {
          form.setError("bgImage", {
            message:
              "Возникла неожиданная ошибка во время загрузки изображения! Повторите попытку позже.",
          });
        }

        setAvatarLoadingProgress(false);

        return;
      }
    }

    await updateProfileMutation.mutateAsync({
      avatar: uploadedAvatar?.[0]?.url,
      bgImage: uploadedBgImage?.[0]?.url,
    });
  };

  useEffect(() => {
    if (session?.user) {
      form.setValue("surname", session.user.surname);
      form.setValue("name", session.user.name);
      form.setValue("fathername", session.user.fathername ?? "");
      form.setValue("group", session.user.group?.name ?? "");
      form.setValue("status", session.user.status ?? "");
    }
  }, [session?.user, form]);

  return (
    <div>
      <h2 className="mb-1 text-2xl font-medium">Профиль</h2>
      <p className="text-muted-foreground">
        Тут вы можете проверить и измененить основную информацию вашего профиля.
      </p>
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="bgImage"
            disabled={form.formState.isSubmitting}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel>Фоновое изображение</FormLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onBgSelect(event.target.files);
                          onChange(
                            event.target.files?.length
                              ? [event.target.files[0]]
                              : [],
                          );
                        }}
                        // value={value?.[0]?.name}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  {typeof bgImageLoadingProgress === "number" ? (
                    <CircularProgress
                      variant={
                        bgImageLoadingProgress === 100
                          ? "indeterminate"
                          : "determinate"
                      }
                      value={bgImageLoadingProgress}
                      className="text-2xl text-primary"
                      strokeWidth={5}
                    />
                  ) : null}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            disabled={form.formState.isSubmitting}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel>Аватар</FormLabel>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          onAvatarSelect(event.target.files);
                          onChange(
                            event.target.files?.length
                              ? [event.target.files[0]]
                              : [],
                          );
                        }}
                        // value={value?.[0]?.name}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  {typeof avatarLoadingProgress === "number" ? (
                    <CircularProgress
                      variant={
                        avatarLoadingProgress === 100
                          ? "indeterminate"
                          : "determinate"
                      }
                      value={avatarLoadingProgress}
                      className="text-2xl text-primary"
                      strokeWidth={5}
                    />
                  ) : null}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surname"
            disabled
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            disabled
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fathername"
            disabled
            render={({ field }) => (
              <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                <FormLabel>Отчество</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {session?.user.role === "Student" ? (
            <FormField
              control={form.control}
              name="group"
              disabled
              render={({ field }) => (
                <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                  <FormLabel>Группа</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="status"
              disabled
              render={({ field }) => (
                <FormItem className="grid gap-x-4 min-[968px]:grid-cols-[15rem_minmax(15rem,30rem)]">
                  <FormLabel>Статус</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <footer className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                form.setValue("bgImage", []);
                form.setValue("avatar", []);
                onCancel();
              }}
              disabled={form.formState.isSubmitting}
            >
              Отменить
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <CircularProgress
                  variant="indeterminate"
                  className="mr-2 text-lg"
                  strokeWidth={5}
                />
              ) : null}
              Сохранить
            </Button>
          </footer>
        </form>
      </Form>
    </div>
  );
};
