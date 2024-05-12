import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { BiTrash } from "react-icons/bi";
import { z } from "zod";
import { Editor } from "~/components/editor";
import { FileUploader } from "~/components/file-uploader";
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
import { handleAttachment } from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";
import { getServerAuthSession } from "~/server/auth";

const formSchema = z.object({
  fullTitle: z.string().min(1, "Обязательное поле!"),
  shortTitle: z.string().min(1, "Обязательное поле!"),
  description: z.string(),
  files: z.array(z.custom<File>()),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateCoursePage: NextPageWithLayout = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullTitle: "",
      shortTitle: "",
      description: "",
      files: [],
    },
  });

  const createCourseMutation = api.course.create.useMutation();

  const onSubmit = (values: FormSchema) => {
    console.log(values);
    // createCourseMutation.mutate({
    //   title: createCourseStore.fullTitle,
    // });
  };

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
            <div className="flex gap-4 max-sm:flex-col sm:items-center">
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
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="files"
                render={({ field: { value, onChange, ...field } }) => (
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
                      Дополнительные материалы
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        multiple
                        onChange={(event) =>
                          onChange(
                            event.target.files
                              ? Array.from(event.target.files)
                              : [],
                          )
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="flex-1 space-y-2">
                <span className="text-sm font-medium">Загружено</span>
                {form.watch("files").length > 0 ? (
                  <ul className="custom-scrollbar max-h-72 space-y-2 overflow-auto">
                    {form.watch("files").map((file) => {
                      console.log(file);
                      const [_name, attachment] = handleAttachment({
                        name: file.name,
                        href: null,
                      });

                      return (
                        <li
                          key={file.lastModified}
                          className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-3"
                        >
                          <span className="row-span-2 text-3xl">
                            {attachment.icon}
                          </span>
                          <p className="truncate font-medium">{file.name}</p>
                          <span className="col-start-2 row-start-2 truncate text-sm capitalize text-muted-foreground">
                            {dayjs(file.lastModified).format(
                              "DD MMM, YYYY HH:ss",
                            )}
                          </span>
                          <Button
                            variant="ghost-destructive"
                            size="icon"
                            className="row-span-2 rounded-full"
                          >
                            <BiTrash className="text-xl" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Тут можно отслеживать загруженные файлы.
                  </p>
                )}
              </div> */}
            </div>
            <footer className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline">
                Сохранить в черновик
              </Button>
              <Button>Опубликовать</Button>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session?.user.role !== "Teacher")
    return {
      redirect: {
        permanent: false,
        destination: PagePathMap.Courses,
      },
    };

  return {
    props: {},
  };
};

export default CreateCoursePage;
