import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BiCheck,
  BiCheckSquare,
  BiExpandVertical,
  BiGitCompare,
  BiTrash,
} from "react-icons/bi";
import { TbBook2, TbListDetails, TbMist } from "react-icons/tb";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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
import { Label } from "~/components/ui/label";
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
import {
  cn,
  getPersonInitials,
  uploadAttachments,
  type ValueOf,
} from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";
import { type Descendant } from "slate";
import { UploadThingError } from "uploadthing/server";
import { toast } from "sonner";
import { FancyMultiSelect } from "~/components/fancy-multi-select";

const LectureEditorNodeTypesMap = {
  TextEditor: "text-editor",
  Quiz: "quiz",
} as const;

type LectureEditorContent = (
  | { id: string; label: string; type: "text-editor"; children: Descendant[] }
  | {
      id: string;
      label: string;
      type: "quiz";
      variant: "right-answer";
      options: { isRight: boolean; label: string }[];
      question: string;
    }
  | {
      id: string;
      label: string;
      type: "quiz";
      variant: "comparison";
      options: { id: string; label: string }[];
      questions: { id: string; label: string }[];
    }
)[];

type LectureEditorElementProps =
  | { id: string; type: "text-editor"; children: Descendant[] }
  | {
      id: string;
      type: "quiz";
      variant: "right-answer";
      options: { isRight: boolean; label: string }[];
      question: string;
    }
  | {
      id: string;
      type: "quiz";
      variant: "comparison";
      options: { id: string; label: string }[];
      questions: { id: string; label: string }[];
    };

const LectureEditorElement: React.FC<LectureEditorElementProps> = ({
  id,
  type,
  ...props
}) => {
  switch (type) {
    case "text-editor":
      return (
        <>
          <div className="space-y-2 overflow-hidden">
            <Label
              htmlFor={id}
              onClick={(event) => {
                document.getElementById(event.currentTarget.htmlFor)?.focus();
              }}
            >
              Лекционный материал
            </Label>
            <Editor
              placeholder="Весь лекционный материал размещается тут..."
              id={id}
            />
          </div>
          <Button
            className="absolute -top-1 right-2 rounded-full"
            variant="ghost-destructive"
            size="icon"
          >
            <BiTrash className="text-xl" />
            <span className="sr-only">Удалить этап лекции</span>
          </Button>
        </>
      );

    default:
      break;
  }

  return null;
};

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
  content: z.custom<LectureEditorContent>(),
  attachments: z.array(z.custom<UploadAttachments>()),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateLecPage: NextPageWithLayout = () => {
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
      content: [
        {
          id: "123",
          label: "Этап №1",
          type: "text-editor",
          children: [{ type: "paragraph", children: [{ text: "" }] }],
        },
      ],
      attachments: [],
    },
  });

  const [customSection, setCustomSection] = useState<string>("");

  const getCreatedCoursesQuery = api.user.getCreatedCourses.useQuery();
  const getStudentsQuery = api.user.getStudents.useQuery();
  const createLectureMutation = api.lecture.create.useMutation({
    onSuccess: (data) => {
      toast.success(
        "Новый лекционный материал успешно опубликован на ваш курс!",
      );
      void router.push(PagePathMap.Course + data.courseId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  const isFormSubmitting = form.formState.isSubmitting;
  const isSessionLoading = !session?.user;

  const onSubmit = async (values: FormSchema) => {
    if (values.attachments.filter((attachment) => attachment.file).length > 0) {
      try {
        await uploadAttachments({
          files: values.attachments.map(({ file }) => file!),
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

    await createLectureMutation.mutateAsync({
      ...values,
      content: JSON.stringify(values.content),
      attachments: form.getValues("attachments").map((attachment) => ({
        key: attachment.key,
        originalName: attachment.originalName,
        uploadedAt: attachment.uploadedAt,
        url: attachment.url!,
        size: attachment.size,
      })),
      strictViewGroups: values.strictViewGroups.map((opt) => opt.value),
      strictViewUsers: values.strictViewUsers.map((opt) => opt.value),
    });
  };

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
            <BreadcrumbPage>Размещение лекционного материала</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">Разместить лекционный материал</h1>
        <p className="text-muted-foreground">
          Разместите лекционный материал в максимально доступном формате.
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
                      <Input placeholder="Заголовок лекции..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {field.value.map((element) => (
                        <fieldset
                          key={element.id}
                          className="relative rounded-lg border-2 border-input p-4 [min-inline-size:unset]"
                        >
                          <legend
                            contentEditable={
                              !isFormSubmitting || !isSessionLoading
                            }
                            suppressContentEditableWarning
                            className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onBlur={(event) => {
                              const value = event.currentTarget.textContent;

                              if (value === "") {
                                event.currentTarget.focus();
                                return;
                              }

                              field.onChange(
                                field.value.map((el) => {
                                  if (el.id === element.id) {
                                    return {
                                      ...el,
                                      label: event.currentTarget.textContent,
                                    };
                                  }

                                  return el;
                                }),
                              );
                            }}
                          >
                            {element.label}
                          </legend>
                          {(() => {
                            switch (element.type) {
                              case "text-editor":
                                return (
                                  <>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={element.id}
                                        onClick={(event) => {
                                          document
                                            .getElementById(
                                              event.currentTarget.htmlFor,
                                            )
                                            ?.focus();
                                        }}
                                      >
                                        Лекционный материал
                                      </Label>
                                      <Editor
                                        placeholder="Лекционный материал этапа размещается тут..."
                                        id={element.id}
                                        disabled={
                                          isFormSubmitting || isSessionLoading
                                        }
                                        onChange={(value) => {
                                          field.onChange(
                                            field.value.map((el) => {
                                              if (
                                                el.id === element.id &&
                                                element.type === "text-editor"
                                              ) {
                                                return {
                                                  ...el,
                                                  children: value,
                                                };
                                              }

                                              return el;
                                            }),
                                          );
                                        }}
                                      />
                                    </div>
                                    <Button
                                      className="absolute -top-1 right-2 rounded-full"
                                      variant="ghost-destructive"
                                      size="icon"
                                      disabled={
                                        field.value.length === 1 ||
                                        isFormSubmitting ||
                                        isSessionLoading
                                      }
                                      onClick={() =>
                                        field.onChange(
                                          field.value.filter(
                                            (el) => el.id !== element.id,
                                          ),
                                        )
                                      }
                                    >
                                      <BiTrash className="text-xl" />
                                      <span className="sr-only">
                                        Удалить этап лекции
                                      </span>
                                    </Button>
                                  </>
                                );

                              default:
                                return null;
                            }
                          })()}
                        </fieldset>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <footer className="flex items-center justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isFormSubmitting || isSessionLoading}
                  >
                    Добавить новый этап
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Этапы лекции</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onSelect={() => {
                        form.setValue("content", [
                          ...form.getValues("content"),
                          {
                            id: crypto.randomUUID(),
                            label: `Этап №${form.getValues("content").length + 1}`,
                            type: "text-editor",
                            children: [
                              { type: "paragraph", children: [{ text: "" }] },
                            ],
                          },
                        ]);
                      }}
                    >
                      <TbBook2 className="mr-2 text-lg" />
                      <span>Лекционный материал</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <TbListDetails className="mr-2 text-lg" />
                        <span>Тестирование</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>
                            <BiCheckSquare className="mr-2 text-lg" />
                            <span>Выбрать правильный вариант</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BiGitCompare className="mr-2 text-lg" />
                            <span>Сопоставление</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TbMist className="mr-2 text-lg" />
                            <span>Вставить пропущенное</span>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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

CreateLecPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CreateLecPage;
