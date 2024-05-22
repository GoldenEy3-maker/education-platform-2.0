import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BiTrash } from "react-icons/bi";
import { toast } from "sonner";
import { z } from "zod";
import { ChooseBgCourseDialogDrawer } from "~/components/choose-bg-course-dialog-drawer";
import { CircularProgress } from "~/components/circular-progress";
import { Editor } from "~/components/editor";
import {
  type UploadAttachments,
  FileUploader,
} from "~/components/file-uploader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { formatBytes, getRandomInt, handleAttachment } from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";

import BgAbstract1 from "~/assets/bg-abstract-1.jpg";
import BgAbstract2 from "~/assets/bg-abstract-2.jpg";
import BgAbstract3 from "~/assets/bg-abstract-3.jpg";
import BgAbstract4 from "~/assets/bg-abstract-4.jpg";
import BgAbstract5 from "~/assets/bg-abstract-5.jpg";
import BgAbstract6 from "~/assets/bg-abstract-6.jpg";
import BgAbstract7 from "~/assets/bg-abstract-7.jpg";
import BgAbstract9 from "~/assets/bg-abstract-9.jpg";

const formSchema = z.object({
  fullTitle: z.string().min(1, "Обязательное поле!"),
  shortTitle: z.string().min(1, "Обязательное поле!"),
  description: z.string(),
  bgImage: z.string().or(z.custom<StaticImageData>()),
  attachments: z.array(z.custom<UploadAttachments>()),
});

type FormSchema = z.infer<typeof formSchema>;

type UploadedAttachmentsListProps = {
  attachments: UploadAttachments[];
  onDelete: (attachments: UploadAttachments[]) => void;
};

const UploadedAttachmentsList: React.FC<UploadedAttachmentsListProps> = ({
  attachments,
  onDelete,
}) => {
  const deleteFile = api.course.deleteAttachment.useMutation({
    onMutate(variables) {
      onDelete(
        attachments.map((attachment) => {
          if (attachment.key === variables.key) {
            return { ...attachment, isDeleting: true };
          }

          return attachment;
        }),
      );
    },
    onSuccess(data, variables) {
      if (data.success === false) {
        onDelete(
          attachments.map((attachment) => {
            if (attachment.key === variables.key) {
              return { ...attachment, isDeleting: false };
            }

            return attachment;
          }),
        );

        toast.error("Неожиданная ошибка! Попробуй позже.");

        return;
      }

      onDelete(
        attachments.filter((attachment) => attachment.key !== variables.key),
      );
    },
    onError(error, variables) {
      onDelete(
        attachments.map((attachment) => {
          if (attachment.key === variables.key) {
            return { ...attachment, isDeleting: false };
          }

          return attachment;
        }),
      );

      toast.error(error.message);
    },
  });
  return (
    <div className="flex-1">
      <span className="text-sm font-medium">Выбрано</span>
      {attachments.length > 0 ? (
        <ul className="custom-scrollbar max-h-72 space-y-2 overflow-auto">
          {attachments.map((attachment) => {
            const [, template] = handleAttachment({
              name: attachment.originalName,
              href: null,
            });

            return (
              <li
                key={attachment.id}
                className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-3"
              >
                <span className="row-span-2 text-3xl">{template.icon}</span>
                <p className="truncate font-medium">
                  {attachment.originalName}
                </p>
                <p
                  className="col-start-2 row-start-2 flex
                           items-center gap-2 truncate text-sm text-muted-foreground"
                >
                  {dayjs(attachment.uploadedAt).format("DD MMM, YYYY HH:ss")}{" "}
                  {attachment.file ? (
                    <>
                      <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground"></span>
                      {attachment.isUploaded
                        ? formatBytes(attachment.file.size)
                        : `${formatBytes(attachment.file.size * (attachment.progress / 100))} / ${formatBytes(attachment.file.size)}`}
                    </>
                  ) : null}
                </p>
                {attachment.isUploaded ? (
                  <Button
                    className="row-span-2 rounded-full"
                    variant="ghost-destructive"
                    size="icon"
                    disabled={attachment.isDeleting}
                    onClick={() => {
                      if (!attachment.key) return;

                      deleteFile.mutate({ key: attachment.key });
                    }}
                  >
                    {attachment.isDeleting ? (
                      <CircularProgress
                        strokeWidth={5}
                        className="text-xl text-primary"
                        variant="indeterminate"
                      />
                    ) : (
                      <BiTrash className="text-xl" />
                    )}
                  </Button>
                ) : (
                  <CircularProgress
                    className="row-span-2 text-2xl text-primary"
                    strokeWidth={5}
                    value={attachment.progress}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Тут будут отображаться выбранные файлы.
        </p>
      )}
    </div>
  );
};

const CreateCoursePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const preloadedBgImages = useMemo(
    () => [
      BgAbstract1,
      BgAbstract2,
      BgAbstract3,
      BgAbstract4,
      BgAbstract5,
      BgAbstract6,
      BgAbstract7,
      BgAbstract9,
    ],
    [],
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bgImage: preloadedBgImages[0],
      fullTitle: "",
      shortTitle: "",
      description: "",
      attachments: [],
    },
  });

  const setAttachments = (value: React.SetStateAction<UploadAttachments[]>) => {
    form.setValue(
      "attachments",
      typeof value === "function"
        ? value(form.getValues("attachments"))
        : value,
    );
  };

  const createCourseMutation = api.course.create.useMutation();

  const onSubmit = (values: FormSchema) => {
    console.log(values);
    // createCourseMutation.mutate({
    //   title: createCourseStore.fullTitle,
    // });
  };

  useEffect(() => {
    if (session?.user && session?.user.role !== "Teacher") {
      void router.push(PagePathMap.Courses);
    }
  }, [router, session]);

  useEffect(() => {
    form.setValue(
      "bgImage",
      preloadedBgImages[getRandomInt(0, preloadedBgImages.length - 1)]!,
    );
  }, [form, preloadedBgImages]);

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={PagePathMap.Courses}>Курсы</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Новый курс</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">Создать новый курс</h1>
        <p className="text-muted-foreground">
          Заполните все поля информации вашего нового курса.
        </p>
      </header>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-wrap gap-5">
              <FormField
                control={form.control}
                name="bgImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Фоновое изображение</FormLabel>
                    <FormControl>
                      <div className="relative h-56 w-full overflow-hidden rounded-md shadow-sm xs:w-80">
                        {typeof field.value === "string" ? (
                          <Image
                            src={field.value}
                            sizes="33vw"
                            fill
                            alt="Фон курса"
                          />
                        ) : (
                          <Image
                            src={field.value}
                            fill
                            blurDataURL={field.value.blurDataURL}
                            placeholder="blur"
                            alt="Фон курса"
                            sizes="33vw"
                          />
                        )}
                      </div>

                      {/* <Input
                      placeholder="Иностранный язык в профессиональной деятельности"
                      {...field}
                    /> */}
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-between gap-2">
                      <ChooseBgCourseDialogDrawer
                        image={
                          typeof form.watch("bgImage") === "string"
                            ? undefined
                            : (form.watch("bgImage") as StaticImageData)
                        }
                        preloadedImages={preloadedBgImages}
                        onImageSelect={field.onChange}
                      >
                        <Button variant="ghost">Выбрать другое</Button>
                      </ChooseBgCourseDialogDrawer>
                      <Button variant="ghost">Загрузить свое</Button>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex-1 basis-72 space-y-4">
                <FormField
                  control={form.control}
                  name="fullTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Полное название курса</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Иностранный язык в профессиональной деятельности"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortTitle"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Сокращенное название курса</FormLabel>
                      <FormControl>
                        <Input placeholder="ИЯПД" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field: { ref, ...field } }) => (
                <FormItem className="w-full">
                  <FormLabel
                    onClick={(event) => {
                      document
                        .getElementById(
                          event.currentTarget.getAttribute("for") ?? "",
                        )
                        ?.focus();
                    }}
                  >
                    Описание
                  </FormLabel>
                  <FormControl>
                    <Editor
                      placeholder="Расскажите студентам, какая цель курса, что будет изучаться и в каком формате..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 max-[1120px]:flex-col min-[1120px]:gap-8">
              <FormField
                control={form.control}
                name="attachments"
                render={({ field: { value, ref, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel
                      onClick={(event) => {
                        document
                          .getElementById(
                            event.currentTarget.getAttribute("for") ?? "",
                          )
                          ?.focus();
                      }}
                    >
                      Дополнительные материалы
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        multiple
                        attachments={value}
                        onChange={setAttachments}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <UploadedAttachmentsList
                attachments={form.watch("attachments")}
                onDelete={setAttachments}
              />
            </div>
            <footer className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline">
                Сохранить в черновик
              </Button>
              <Button
                disabled={form
                  .watch("attachments")
                  .some(
                    (attachment) =>
                      attachment.isDeleting || !attachment.isUploaded,
                  )}
              >
                Опубликовать
              </Button>
            </footer>
          </form>
        </Form>
      </div>
    </main>
  );
};

CreateCoursePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CreateCoursePage;
