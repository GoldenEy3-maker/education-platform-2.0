import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCheck, BiExpandVertical } from "react-icons/bi";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { Editor } from "~/components/editor";
import { FancyMultiSelect } from "~/components/fancy-multi-select";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { api, type RouterOutputs } from "~/libs/api";
import { PagePathMap } from "~/libs/enums";
import { cn, getPersonInitials } from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";

const formSchema = z.object({
  courseId: z.string().min(1, "Обязательно поле!"),
  section: z.string().min(1, "Обязательное поле!"),
  title: z.string().min(1, "Обязательное поле!"),
  strictViewUsers: z.array(z.object({ value: z.string(), label: z.string() })),
  strictViewGroups: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
  attachments: z.array(z.custom<UploadAttachments>()),
  details: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateQuizPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      section: "",
      title: "",
      strictViewUsers: [],
      strictViewGroups: [],
      attachments: [],
      details: "",
    },
  });

  const [customSection, setCustomSection] = useState<string>("");

  const getCreatedCoursesQuery = api.user.getCreatedCourses.useQuery();
  const getStudentsQuery = api.user.getStudents.useQuery();

  const createdCourseByRouterQuery = useMemo(() => {
    if (router.query.courseId && getCreatedCoursesQuery.data) {
      return getCreatedCoursesQuery.data.find(
        (course) => course.id === router.query.courseId,
      );
    }

    return undefined;
  }, [router, getCreatedCoursesQuery.data]);

  const selectedCreatedCourse = getCreatedCoursesQuery.data?.find(
    (course) => course.id === form.watch("courseId"),
  );

  const selectedCourseSections = useMemo(() => {
    return selectedCreatedCourse?.tasks.reduce<string[]>((acc, task) => {
      if (!acc.includes(task.section)) {
        acc.push(task.section);
      }

      return acc;
    }, []);
  }, [selectedCreatedCourse]);

  const setAttachments = (value: React.SetStateAction<UploadAttachments[]>) => {
    form.setValue(
      "attachments",
      typeof value === "function"
        ? value(form.getValues("attachments"))
        : value,
    );
  };

  const onSubmit = (values: FormSchema) => {
    console.log(values);
  };

  const isFormSubmitting = form.formState.isSubmitting;
  const isSessionLoading = !session?.user;

  useEffect(() => {
    if (session?.user && session?.user.role !== "Teacher") {
      void router.push(PagePathMap.Courses);
    }
  }, [router, session]);

  useEffect(() => {
    if (createdCourseByRouterQuery) {
      form.setValue("courseId", createdCourseByRouterQuery.id);
    }
  }, [createdCourseByRouterQuery, form]);

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={PagePathMap.Courses}>Курсы</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {!getCreatedCoursesQuery.isLoading ? (
            createdCourseByRouterQuery ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href={PagePathMap.Course + createdCourseByRouterQuery.id}
                    >
                      {createdCourseByRouterQuery.fullTitle}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ) : null
          ) : (
            <>
              <BreadcrumbItem>
                <Skeleton className="h-5 w-52 rounded-full sm:w-72" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>Размещение практического задания</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">
          Разместить практическое задание
        </h1>
        <p className="text-muted-foreground">
          Разместите практическое задание с возможность развернутого ответа или
          прикрепление своего файла.
        </p>
      </header>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Разместить на курсе</FormLabel>
                  {!getCreatedCoursesQuery.isLoading ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="flex h-11 w-full justify-between"
                            disabled={isFormSubmitting || isSessionLoading}
                          >
                            <span className="truncate">
                              {field.value
                                ? getCreatedCoursesQuery.data?.find(
                                    (course) => course.id === field.value,
                                  )?.fullTitle
                                : "Выберите курс..."}
                            </span>
                            <BiExpandVertical className="ml-2 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Command>
                          <CommandInput placeholder="Поиск курса..." />
                          <CommandList className="custom-scrollbar max-h-60 overflow-auto">
                            <CommandEmpty>
                              Не найдено такого курса.
                            </CommandEmpty>
                            <CommandGroup>
                              {getCreatedCoursesQuery.data?.map((course) => (
                                <CommandItem
                                  value={course.id}
                                  key={course.id}
                                  onSelect={() => {
                                    field.onChange(course.id);
                                  }}
                                  asChild
                                >
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-auto min-h-10 w-full justify-start whitespace-normal text-left"
                                  >
                                    <BiCheck
                                      className={cn(
                                        "mr-2 shrink-0",
                                        course.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {course.fullTitle}
                                  </Button>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Skeleton className="h-10 w-full rounded-md" />
                  )}
                  <FormDescription>
                    Выберите один из своих курсов, на котором будет размещено
                    задание.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-x-5 gap-y-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Раздел курса</FormLabel>
                    {!getCreatedCoursesQuery.isLoading ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="flex h-11 w-full justify-between"
                              disabled={isFormSubmitting || isSessionLoading}
                            >
                              <span className="truncate">
                                {field.value !== ""
                                  ? field.value
                                  : "Выберите раздел..."}
                              </span>
                              <BiExpandVertical className="ml-2 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-full max-w-[43rem] p-0"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Поиск разделов..."
                              onValueChange={(value) => setCustomSection(value)}
                            />
                            <CommandList className="max-h-60 overflow-auto">
                              <CommandEmpty className="whitespace-pre-wrap px-6">
                                {form.getValues("courseId") === ""
                                  ? "Необходими выбрать курс, чтобы увидеть разделы заданий."
                                  : "На выбранном курсе все еще нет разделов.\n Вы можете вписать название нового раздела тут, чтобы его создать."}
                              </CommandEmpty>
                              <CommandGroup>
                                {selectedCourseSections?.map((section) => (
                                  <CommandItem
                                    value={section}
                                    key={section}
                                    onSelect={() => {
                                      field.onChange(section);
                                    }}
                                    asChild
                                  >
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      className="h-auto min-h-10 w-full justify-start whitespace-normal text-left"
                                    >
                                      <BiCheck
                                        className={cn(
                                          "mr-2 shrink-0",
                                          section === field.value
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {section}
                                    </Button>
                                  </CommandItem>
                                ))}
                                {customSection !== "" &&
                                !selectedCourseSections?.includes(
                                  customSection,
                                ) ? (
                                  <CommandItem
                                    value={customSection}
                                    key={customSection}
                                    onSelect={() => {
                                      field.onChange(customSection);
                                    }}
                                  >
                                    <BiCheck
                                      className={cn(
                                        "mr-2 shrink-0",
                                        customSection === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {customSection}
                                  </CommandItem>
                                ) : null}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Skeleton className="h-11 w-full rounded-md" />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                disabled={isFormSubmitting || isSessionLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Заголовок практического задания..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="details"
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
                    <Editor
                      placeholder="Детально опишите само задание..."
                      onChange={(value) => onChange(JSON.stringify(value))}
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, ref, onChange, ...field } }) => (
                <AttachmentsUploader
                  attachments={value}
                  onChange={setAttachments}
                  isLoading={isFormSubmitting || isSessionLoading}
                  multiple
                  {...field}
                />
              )}
            />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-x-5 gap-y-4">
              <FormField
                control={form.control}
                name="strictViewUsers"
                disabled={isFormSubmitting || isSessionLoading}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Ограничения просмотра для студентов</FormLabel>
                    {!getStudentsQuery.isLoading ? (
                      <FormControl>
                        <FancyMultiSelect
                          placeholder="Выберите студента..."
                          value={value}
                          onValueChange={onChange}
                          options={
                            getStudentsQuery.data
                              ?.map((user) => ({
                                value: user.id,
                                label: getPersonInitials(
                                  user.surname,
                                  user.name,
                                  user.fathername,
                                ),
                              }))
                              .sort((a, b) => a.label.localeCompare(b.label)) ??
                            []
                          }
                          {...field}
                        />
                      </FormControl>
                    ) : (
                      <Skeleton className="h-9 w-full rounded-md" />
                    )}

                    <FormDescription className="whitespace-pre-wrap">
                      {
                        "Укажите студентов, которые будут иметь доступ до этого задания. \n*Если ничего не указывать, доступ будет у всех."
                      }
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="strictViewGroups"
                disabled={isFormSubmitting || isSessionLoading}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Ограничения просмотра для групп</FormLabel>
                    {!getStudentsQuery.isLoading ? (
                      <FormControl>
                        <FancyMultiSelect
                          placeholder="Выберите группу..."
                          value={value}
                          onValueChange={onChange}
                          options={
                            getStudentsQuery.data
                              ?.reduce<RouterOutputs["user"]["getStudents"]>(
                                (acc, user) => {
                                  if (!user.groupId) return acc;

                                  if (
                                    acc.find(
                                      (u) => u.groupId === user.groupId,
                                    ) === undefined
                                  ) {
                                    acc.push(user);
                                  }

                                  return acc;
                                },
                                [],
                              )
                              .sort((a, b) =>
                                b.group!.name.localeCompare(
                                  a.group!.name,
                                  undefined,
                                  {
                                    numeric: true,
                                  },
                                ),
                              )
                              .map((user) => {
                                return {
                                  value: user.groupId!,
                                  label: user.group!.name,
                                };
                              }) ?? []
                          }
                          {...field}
                        />
                      </FormControl>
                    ) : (
                      <Skeleton className="h-9 w-full rounded-md" />
                    )}
                    <FormDescription className="whitespace-pre-wrap">
                      {
                        "Укажите группы, которые будут иметь доступ до этого задания. \n*Если ничего не указывать, доступ будет у всех."
                      }
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <footer className="flex items-center justify-end gap-2">
              <Button disabled={isFormSubmitting || isSessionLoading}>
                Опубликовать
              </Button>
            </footer>
          </form>
        </Form>
      </div>
    </main>
  );
};

CreateQuizPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CreateQuizPage;
