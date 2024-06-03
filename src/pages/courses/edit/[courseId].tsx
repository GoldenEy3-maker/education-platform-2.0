import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCog, BiHive, BiNotepad } from "react-icons/bi";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { SelectBgImage } from "~/components/course-mutation/select-bg-image";
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
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useRouterQueryState } from "~/hooks/routerQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { type ValueOf } from "~/libs/utils";
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
        <BiHive className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Основная информация",
    },
    Tasks: {
      icon: (
        <BiNotepad className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Задания",
    },
    Settings: {
      icon: (
        <BiCog className="shrink-0 text-xl group-data-[state=active]:text-primary" />
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
  const { data: session } = useSession();

  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "Info");

  const courseGetByIdQuery = api.course.getById.useQuery(
    {
      id: router.query.courseId as string,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const [preloadedImage, setPreloadedImage] = useState(preloadedBgImages[0]!);

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
    form.watch("attachments").some((attachment) => attachment.isUploading) ||
    courseGetByIdQuery.isLoading;

  const onSubmit = async (values: FormSchema) => {
    console.log(values);
  };

  useEffect(() => {
    if (session?.user && session?.user.role !== "Teacher") {
      void router.push(PagePathMap.Course + +router.query.courseId!);
    }
  }, [router, session]);

  useEffect(() => {
    if (courseGetByIdQuery.data) {
      setPreloadedImage(courseGetByIdQuery.data.image);
      form.setValue("fullTitle", courseGetByIdQuery.data.fullTitle);
      form.setValue("shortTitle", courseGetByIdQuery.data.shortTitle ?? "");
      form.setValue("description", courseGetByIdQuery.data.description ?? "");
    }
  }, [courseGetByIdQuery.data, form]);

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={PagePathMap.Courses}>Курсы</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!courseGetByIdQuery.isLoading ? (
              <BreadcrumbLink asChild>
                <Link href={PagePathMap.Course + courseGetByIdQuery.data?.id}>
                  {courseGetByIdQuery.data?.fullTitle}
                </Link>
              </BreadcrumbLink>
            ) : (
              <Skeleton className="h-5 w-52 rounded-full sm:w-72" />
            )}
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
                        <FormLabel htmlFor="bg-course">
                          Фоновое изображение
                        </FormLabel>
                        <FormControl>
                          <SelectBgImage
                            isImageUploaded={field.value.length > 0}
                            loadingProgress={bgImageLoadingProgress}
                            isLoading={isLoading}
                            onUploadImage={(image) => field.onChange([image])}
                            preloadedImage={preloadedImage}
                            preloadedImages={preloadedBgImages}
                            isPreloadedImageLoading={
                              courseGetByIdQuery.isLoading
                            }
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
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                        {!courseGetByIdQuery.isLoading ? (
                          <Editor
                            defaultValue={
                              courseGetByIdQuery.data?.description ?? ""
                            }
                            placeholder="Расскажите студентам, какая цель курса, что будет изучаться и в каком формате..."
                            {...field}
                          />
                        ) : (
                          <Skeleton className="h-36 w-full rounded-md" />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachments"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void router.back()}
                    disabled={isLoading}
                  >
                    Отменить
                  </Button>
                  <Button disabled={isLoading}>Сохранить</Button>
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
