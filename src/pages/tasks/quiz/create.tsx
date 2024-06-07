import { zodResolver } from "@hookform/resolvers/zod";
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
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { AutoComplete } from "~/components/autocomplete";
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
import { cn } from "~/libs/utils";
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

type QuizQuestion = {
  id: string;
  question: string;
  options: {
    label: string;
    isRight: boolean;
  }[];
};

const formSchema = z.object({
  courseId: z.string(),
  section: z.string(),
  title: z.string(),
  attachments: z.array(z.custom<UploadAttachments>()),
  questions: z.array(z.custom<QuizQuestion>()),
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
      questions: [],
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
            <BreadcrumbPage>Составление тестового задания</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="mb-4">
        <h1 className="text-2xl font-medium">Составить тестовое задание</h1>
        <p className="text-muted-foreground">
          Составьте тестовое задание для проверки знаний студентов.
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
                      <Input placeholder="Заголовок теста..." {...field} />
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
                  // isLoading={isLoading}
                  multiple
                  {...field}
                />
              )}
            />
            <fieldset className="rounded-lg border-2 border-input p-4">
              <legend>Вопрос №1</legend>
              <Input
                type="text"
                placeholder="Впишите вопрос..."
                leadingIcon={<BiQuestionMark className="text-xl" />}
              />
              <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-2">
                <span className="text-sm">Правильный ответ</span>
                <span className="text-sm">Вариант ответа</span>
                <span className="text-sm">Удалить ответ</span>
                <div className="flex items-center justify-center">
                  <Switch />
                </div>
                <Input placeholder="Вариант ответа..." />
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    className="rounded-full"
                  >
                    <BiTrash className="text-xl" />
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Switch />
                </div>
                <Input placeholder="Вариант ответа..." />
                <div className="flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    className="rounded-full"
                  >
                    <BiTrash className="text-xl" />
                  </Button>
                </div>
              </div>
              <footer className="mt-4 grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" className="gap-2">
                  <BiPlus className="text-xl" />{" "}
                  <span>Добавить вариант ответа</span>
                </Button>
                <Button
                  type="button"
                  variant="outline-destructive"
                  className="gap-2"
                >
                  <BiTrash className="text-xl" /> <span>Удалить вопрос</span>
                </Button>
              </footer>
            </fieldset>
            <footer className="flex items-center justify-end gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline">
                    {/* <BiPlus className="text-xl" /> */}
                    Добавить вопрос
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Варианты тестирования</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
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
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
