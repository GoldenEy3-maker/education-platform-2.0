import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidCog, BiSolidNotepad, BiSolidWidget } from "react-icons/bi";
import { type ClientUploadedFileData } from "uploadthing/types";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { SelectBgImage } from "~/components/create-course/select-bg-image";
import { Editor } from "~/components/editor";
import { type UploadAttachments } from "~/components/file-uploader";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useFileReader } from "~/hooks/fileReader";
import { useRouterQueryState } from "~/hooks/routerQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import {
  getRandomInt,
  handleFileName,
  uploadFiles,
  type ValueOf,
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

const TabsMap = {
  Info: "Info",
  Tasks: "Tasks",
  Settings: "Settings",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { text: string; icon: React.ReactNode }> =
  {
    Info: {
      icon: (
        <BiSolidWidget className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Основная информация",
    },
    Tasks: {
      icon: (
        <BiSolidNotepad className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Задания",
    },
    Settings: {
      icon: (
        <BiSolidCog className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Настройки",
    },
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

const EditCoursePage: NextPageWithLayout = () => {
  const router = useRouter();
  const fileReader = useFileReader();
  const { data: session } = useSession();

  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "Info");

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

  const createCourseMutation = api.course.create.useMutation({
    // onSettled: () => {
    // setBgImageLoadingProgress(false);
    // },
  });

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
          console.log("begin");
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
          console.log("progress");
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
            <BreadcrumbPage>Редактирование курса</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">Редактировать курс</h1>
        <p className="text-muted-foreground">
          Заполните все поля информации вашего курса.
        </p>
      </header>
      <Tabs
        value={tabs}
        onValueChange={(value) => setTabs(value as TabsMap)}
        className="mt-4"
      >
        <TabsList className="hidden-scrollbar mb-4 flex h-auto max-w-full justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
          {Object.entries(TabsTriggerMap).map(([key, value]) => (
            <TabsTrigger
              value={key}
              asChild
              key={key}
              className="group h-auto shrink-0 gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
            >
              <Button variant="ghost" type="button">
                {value.icon}
                <span>{value.text}</span>
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={TabsMap.Info}>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-5">
                  <FormField
                    control={form.control}
                    name="bgImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Фоновое изображение</FormLabel>
                        <FormControl>
                          <SelectBgImage
                            isImageUploaded={field.value.length > 0}
                            loadingProgress={bgImageLoadingProgress}
                            isLoading={isLoading}
                            onUploadImage={(image) => field.onChange([image])}
                            preloadedImage={preloadedImage}
                            preloadedImages={preloadedBgImages}
                            onSelectPreloadedImage={(image) => {
                              setPreloadedImage(image);
                              field.onChange([]);
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
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field: { value, ref, onChange, ...field } }) => (
                    <AttachmentsUploader
                      attachments={value}
                      onChange={setAttachments}
                      isLoading={isLoading}
                      multiple
                      {...field}
                    />
                  )}
                />
                <footer className="flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" disabled={isLoading}>
                    Сохранить в черновик
                  </Button>
                  <Button disabled={isLoading}>Опубликовать</Button>
                </footer>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

EditCoursePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default EditCoursePage;
