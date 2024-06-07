import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UploadThingError } from "uploadthing/server";
import { type ClientUploadedFileData } from "uploadthing/types";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { SelectBgImage } from "~/components/select-bg-image";
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
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { api } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import {
  handleFileName,
  isValidUrl,
  uploadAttachments,
  uploadFiles,
} from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";

const formSchema = z.object({
  fullTitle: z.string().min(1, "Обязательное поле!"),
  shortTitle: z.string(),
  description: z.string(),
  bgImage: z.array(z.custom<File>()),
  attachments: z.array(z.custom<UploadAttachments>()),
});

type FormSchema = z.infer<typeof formSchema>;

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

  const editCourseMutation = api.course.edit.useMutation({
    onSuccess: () => {
      toast.success("Все изменения успешно сохранены!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setBgImageLoadingProgress(false);
    },
  });

  const isLoading = form.formState.isSubmitting || courseGetByIdQuery.isLoading;

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
      try {
        uploadedBgImage = await uploadFiles("image", {
          files: values.bgImage.map((file) => {
            const [, ext] = handleFileName(file.name);

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

    const attachedFiles = values.attachments.filter(
      (attachment) => attachment.file,
    );

    if (attachedFiles.length > 0) {
      try {
        await uploadAttachments({
          files: attachedFiles.map((attachment) => attachment.file!),
          setAttachments,
        });
      } catch (error) {
        if (error instanceof UploadThingError) {
          form.setError("attachments", { message: error.message });
        } else {
          form.setError("attachments", {
            message:
              "Возникла неожиданная ошибка во время загрузки дополнительного материала! Повторите попытку позже.",
          });
        }

        return;
      }
    }

    const isPrevBgImageDeleting =
      isValidUrl(courseGetByIdQuery.data!.image) &&
      (uploadedBgImage.length > 0 || preloadedImage.startsWith("/"));

    editCourseMutation.mutate({
      id: courseGetByIdQuery.data!.id,
      fullTitle: values.fullTitle,
      shortTitle: values.shortTitle,
      description: values.description,
      image:
        uploadedBgImage.length > 0 ? uploadedBgImage[0]!.url : preloadedImage,
      imageToDelete: isPrevBgImageDeleting
        ? courseGetByIdQuery.data?.image
        : undefined,
      attachments: form
        .getValues("attachments")
        .filter((attachment) => attachment.file!)
        .map((attachment) => ({
          key: attachment.key,
          originalName: attachment.originalName,
          uploadedAt: attachment.uploadedAt,
          url: attachment.url!,
          size: attachment.size,
        })),
      attachmentsToDelete: courseGetByIdQuery.data?.attachments
        .filter((dataAttachment) => {
          return values.attachments.every(
            (attachment) => attachment.id !== dataAttachment.id,
          );
        })
        .map((attachment) => ({
          id: attachment.id,
          key: attachment.key,
        })),
    });
  };

  useEffect(() => {
    if (
      session?.user &&
      courseGetByIdQuery.data &&
      courseGetByIdQuery.data.authorId !== session.user.id
    ) {
      void router.push(
        typeof router.query.courseId === "string"
          ? PagePathMap.Course + router.query.courseId
          : PagePathMap.Courses,
      );
    }
  }, [router, session, courseGetByIdQuery.data]);

  useEffect(() => {
    if (courseGetByIdQuery.data) {
      setPreloadedImage(courseGetByIdQuery.data.image);
      form.setValue("fullTitle", courseGetByIdQuery.data.fullTitle);
      form.setValue("shortTitle", courseGetByIdQuery.data.shortTitle ?? "");
      form.setValue("description", courseGetByIdQuery.data.description ?? "");
      form.setValue(
        "attachments",
        courseGetByIdQuery.data.attachments.map((attachment) => {
          return {
            id: attachment.id,
            isUploading: false,
            originalName: attachment.name,
            progress: 0,
            uploadedAt: attachment.uploadedAt,
            key: attachment.key ?? undefined,
            size: attachment.size ?? undefined,
            url: attachment.url,
          };
        }),
      );
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
          Все изменения применяются моментально.
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
                        isImageUploaded={field.value.length > 0}
                        loadingProgress={bgImageLoadingProgress}
                        isLoading={isLoading}
                        onUploadImage={(image) => {
                          field.onChange([image]);
                        }}
                        preloadedImage={preloadedImage}
                        preloadedImages={preloadedBgImages}
                        isPreloadedImageLoading={courseGetByIdQuery.isLoading}
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
                    {!courseGetByIdQuery.isLoading ? (
                      <Editor
                        defaultValue={
                          courseGetByIdQuery.data?.description ?? ""
                        }
                        placeholder="Расскажите студентам, какая цель курса, что будет изучаться и в каком формате..."
                        onChange={(value) => onChange(JSON.stringify(value))}
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
                  isLoadingSkeleton={courseGetByIdQuery.isLoading}
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
    </main>
  );
};

EditCoursePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default EditCoursePage;
