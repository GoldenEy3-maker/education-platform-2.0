import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Editor } from "~/components/editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { CreateCourseLayout } from "~/layouts/create-course";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "~/pages/_app";
import { useCreateCourseStore } from "~/store/create-course";

export const formSchema = z.object({
  fullTitle: z.string().min(1, "Обязательное поле!"),
  shortTitle: z.string().min(1, "Обязательное поле!"),
  description: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateCoursePage: NextPageWithLayout = () => {
  const router = useRouter();
  const createCourseStore = useCreateCourseStore();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullTitle: createCourseStore.fullTitle,
      shortTitle: createCourseStore.shortTitle,
      description: createCourseStore.description,
    },
  });

  const onSubmit = (values: FormSchema) => {
    createCourseStore.setFullTitle(values.fullTitle);
    createCourseStore.setShortTitle(values.shortTitle);
    createCourseStore.setDescription(values.description);

    void router.push(PagePathMap.CreateCourseContent);
  };

  return (
    <div>
      <Form {...form}>
        <form
          id="create-course-index"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
        </form>
      </Form>
    </div>
  );
};

CreateCoursePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>
      <CreateCourseLayout formId="create-course-index">
        {page}
      </CreateCourseLayout>
    </MainLayout>
  </ScaffoldLayout>
);
export default CreateCoursePage;
