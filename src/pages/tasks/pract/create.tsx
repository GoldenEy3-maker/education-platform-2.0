import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  BiCheck,
  BiCheckSquare,
  BiExpandVertical,
  BiGitCompare,
  BiPlus,
  BiQuestionMark,
  BiTrash,
} from "react-icons/bi";
import { TbMist } from "react-icons/tb";
import { z } from "zod";
import { AutoComplete } from "~/components/autocomplete";
import { CircularProgress } from "~/components/circular-progress";
import { Editor } from "~/components/editor";
import {
  FileUploader,
  type UploadAttachments,
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
import { Checkbox } from "~/components/ui/checkbox";
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
  DropdownMenuSeparator,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Switch } from "~/components/ui/switch";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { cn, formatBytes, handleAttachment } from "~/libs/utils";
import { type NextPageWithLayout } from "~/pages/_app";

const createdCourses = [
  {
    id: "1",
    label: "Иностранный язык в профессиональной деятельности",
  },
  {
    id: "2",
    label: "Разработка кода и информационных систем",
  },
  {
    id: "3",
    label: "Высшая математика",
  },
  {
    id: "4",
    label: "Проектирование и дизайн информационных систем",
  },
];

const formSchema = z.object({
  courseId: z.string(),
  section: z.string(),
  title: z.string(),
  description: z.string(),
  attachments: z.array(z.custom<UploadAttachments>()),
});

type FormSchema = z.infer<typeof formSchema>;

type AttachmentsListProps = {
  attachments: UploadAttachments[];
  onDelete: (attachments: UploadAttachments[]) => void;
};

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

const CreateQuizPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      section: "",
      title: "",
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

  const onSubmit = (values: FormSchema) => {
    console.log(values);
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
            <BreadcrumbPage>Размещение праактического задания</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">
          Разместить практическое задание
        </h1>
        <p className="text-muted-foreground">
          Разместить практическое задание с развернутым ответом или прикрепление
          своего файла.
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="flex w-full justify-between"
                        >
                          {field.value
                            ? createdCourses.find(
                                (course) => course.id === field.value,
                              )?.label
                            : "Выберите курс..."}
                          <BiExpandVertical className="ml-2 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Поиск курса..." />
                        <CommandList>
                          <CommandEmpty>Не найдено такого курса.</CommandEmpty>
                          <CommandGroup>
                            {createdCourses.map((course) => (
                              <CommandItem
                                value={course.label}
                                key={course.id}
                                onSelect={() => {
                                  field.onChange(course.id);
                                }}
                              >
                                <BiCheck
                                  className={cn(
                                    "mr-2",
                                    course.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {course.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Выберите один из своих курсов, на котором будет размещено
                    задание.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-wrap gap-5">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Раздел</FormLabel>
                    <FormControl>
                      <AutoComplete
                        emptyMessage="Не найдено такого раздела."
                        options={[
                          { label: "1.1 Unit", value: "1.1 Unit" },
                          { label: "1.2 Unit", value: "1.2 Unit" },
                        ]}
                        placeholder="Выберите раздел курса..."
                        onValueChange={field.onChange}
                        disabled={field.disabled}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Заголовок задания..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
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
                    Дополнительная информация
                  </FormLabel>
                  <FormControl>
                    <Editor
                      placeholder="Дополнительная информация к практическому заданию..."
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
                        // disabled={isLoading}
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
              <Button>Опубликовать</Button>
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
