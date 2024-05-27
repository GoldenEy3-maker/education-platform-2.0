import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCheck, BiTrash } from "react-icons/bi";
import { type ClientUploadedFileData } from "uploadthing/types";
import { z } from "zod";
import { CircularProgress } from "~/components/circular-progress";
import { SelectBgImage } from "~/components/create-course/select-bg-image";
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
import {
  formatBytes,
  getRandomInt,
  handleAttachment,
  handleFileName,
  uploadFiles,
} from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";

const formSchema = z.object({
  fullTitle: z.string().min(1, "Обязательное поле!"),
  shortTitle: z.string().min(1, "Обязательное поле!"),
  description: z.string(),
  bgImage: z.array(z.custom<File>()),
  attachments: z.array(z.custom<UploadAttachments>()),
});

type FormSchema = z.infer<typeof formSchema>;

type AttachmentsListProps = {
  attachments: UploadAttachments[];
  onDelete: (attachments: UploadAttachments[]) => void;
};

const preloadedBgImages = [
  "/bg-abstract-1.jpg",
  "/bg-abstract-2.jpg",
  "/bg-abstract-3.jpg",
  "/bg-abstract-4.jpg",
  "/bg-abstract-5.jpg",
  "/bg-abstract-6.jpg",
  "/bg-abstract-7.jpg",
  "/bg-abstract-9.jpg",
];

const AttachmentsList: React.FC<AttachmentsListProps> = ({
  attachments,
  onDelete,
}) => {
  return (
    <div className="flex-1">
      <span className="text-sm font-medium">Выбрано</span>
      {attachments.length > 0 ? (
        <ul className="custom-scrollbar max-h-72 space-y-2 overflow-auto">
          {attachments.map((attachment) => {
            const [, template] = handleAttachment({
              name: attachment.originalName,
              key: attachment.key ?? null,
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
                      {attachment.isUploading
                        ? `${formatBytes(attachment.file.size * (attachment.progress / 100))} / ${formatBytes(attachment.file.size)}`
                        : formatBytes(attachment.file.size)}
                    </>
                  ) : null}
                </p>
                {attachment.isUploading ? (
                  <CircularProgress
                    variant={
                      attachment.progress === 100
                        ? "indeterminate"
                        : "determinate"
                    }
                    className="row-span-2 text-2xl text-primary"
                    strokeWidth={5}
                    value={
                      attachment.progress < 100
                        ? attachment.progress
                        : undefined
                    }
                  />
                ) : attachment.key ? (
                  <span className="row-span-2 flex items-center justify-center">
                    <BiCheck className="text-2xl text-primary" />
                  </span>
                ) : (
                  <Button
                    type="button"
                    className="row-span-2 rounded-full"
                    variant="ghost-destructive"
                    size="icon"
                    onClick={() => {
                      onDelete(
                        attachments.filter((a) => a.id !== attachment.id),
                      );
                    }}
                  >
                    <BiTrash className="text-xl" />
                  </Button>
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

  const [preloadedImage, setPreloadedImage] = useState(
    () => preloadedBgImages[getRandomInt(0, preloadedBgImages.length - 1)]!,
  );

  const [bgImageLoadingProgress, setBgImageLoadingProgress] = useState<
    boolean | number
  >(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bgImage: [],
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

  const createCourseMutation = api.course.create.useMutation({});

  const isLoading =
    typeof bgImageLoadingProgress === "number" ||
    createCourseMutation.isLoading ||
    form.watch("attachments").some((attachment) => attachment.isUploading);

  const onSubmit = async (values: FormSchema) => {
    let uploadedBgImage: ClientUploadedFileData<{
      name: string;
      size: number;
      type: string;
      customId: string | null;
      key: string;
      url: string;
    }>[] = [];

    if (values.bgImage.length > 0) {
      uploadFiles("uploader", {
        files: values.bgImage.map((file) => {
          const [_, ext] = handleFileName(file.name);

          return new File([file], crypto.randomUUID() + "." + ext, {
            type: file.type,
          });
        }),
        onUploadBegin: () => {
          setBgImageLoadingProgress(0);
        },
        onUploadProgress: (opts) => {
          setBgImageLoadingProgress(opts.progress);
        },
      })
        .then((uploadedData) => {
          uploadedBgImage = uploadedData;
          setBgImageLoadingProgress(true);
        })
        .catch((error) => console.error(error));
    }

    if (values.attachments.filter((attachment) => attachment.file).length > 0) {
      uploadFiles("uploader", {
        files: values.attachments.map(({ file }) => file!),
        onUploadBegin(opts) {
          setAttachments((attachments) =>
            attachments.map((attachment) => {
              if (opts.file === attachment.file?.name) {
                return {
                  ...attachment,
                  isUploading: true,
                };
              }

              return attachment;
            }),
          );
        },
        onUploadProgress(opts) {
          setAttachments((attachments) =>
            attachments.map((attachment) => {
              if (opts.file === attachment.file?.name) {
                return {
                  ...attachment,
                  progress: opts.progress,
                };
              }

              return attachment;
            }),
          );
        },
      })
        .then((uploadedAttachments) => {
          setAttachments((attachments) =>
            attachments.map((attachment) => {
              const upFile = uploadedAttachments.find(
                (upFile) => upFile.name === attachment.file?.name,
              );
              if (upFile) {
                return {
                  ...attachment,
                  key: upFile.key,
                  url: upFile.url,
                  isUploading: false,
                };
              }

              return attachment;
            }),
          );
        })
        .catch((error) => console.error(error));
    }

    createCourseMutation.mutate({
      title: values.fullTitle,
    });
  };

  useEffect(() => {
    if (session?.user && session?.user.role !== "Teacher") {
      void router.push(PagePathMap.Courses);
    }
  }, [router, session]);

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
                    <FormLabel htmlFor="bg-course">
                      Фоновое изображение
                    </FormLabel>
                    <FormControl>
                      <SelectBgImage
                        isImageUploaded={form.watch("bgImage").length > 0}
                        loadingProgress={bgImageLoadingProgress}
                        isLoading={isLoading}
                        onUploadImage={(image) =>
                          form.setValue("bgImage", [image])
                        }
                        preloadedImage={preloadedImage}
                        preloadedImages={preloadedBgImages}
                        onSelectPreloadedImage={(image) => {
                          setPreloadedImage(image);
                          form.setValue("bgImage", []);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex-1 basis-72 space-y-4">
                <FormField
                  control={form.control}
                  name="fullTitle"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
              disabled={isLoading}
              render={({ field: { ref, onChange, ...field } }) => (
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
                      onChange={(value) => onChange(JSON.stringify(value))}
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
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <AttachmentsList
                attachments={form.watch("attachments")}
                onDelete={setAttachments}
              />
            </div>
            <footer className="flex items-center justify-end gap-2">
              <Button disabled={isLoading}>Опубликовать</Button>
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
