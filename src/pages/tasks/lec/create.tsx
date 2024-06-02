import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiCheck, BiExpandVertical } from "react-icons/bi";
import { z } from "zod";
import { AttachmentsUploader } from "~/components/attachments-uploader";
import { AutoComplete } from "~/components/autocomplete";
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

const formSchema = z.object({
  courseId: z.string(),
  section: z.string(),
  title: z.string(),
  content: z.string(),
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
      content: "",
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
                  // isLoading={isLoading}
                  multiple
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="content"
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
                    Лекционный материал
                  </FormLabel>
                  <FormControl>
                    <Editor
                      className="!min-h-60"
                      placeholder="Весь лекционный материал размещается тут..."
                      onChange={(value) => onChange(JSON.stringify(value))}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
