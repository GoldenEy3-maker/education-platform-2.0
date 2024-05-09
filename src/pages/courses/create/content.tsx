import { useRouter } from "next/router";
import { useEffect } from "react";
import { CreateCourseLayout } from "~/layouts/create-course";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "~/pages/_app";
import { useCreateCourseStore } from "~/store/create-course";
import { formSchema as indexFormSchema } from "./index";

const CreateCourseContent: NextPageWithLayout = () => {
  const router = useRouter();
  const createCourseStore = useCreateCourseStore();

  useEffect(() => {
    if (!indexFormSchema.safeParse(createCourseStore).success)
      void router.push(PagePathMap.CreateCourse);
  }, [createCourseStore, router]);
  return <div>CreateCourseContent</div>;
};

CreateCourseContent.getLayout = (page) => {
  return (
    <ScaffoldLayout>
      <MainLayout>
        <CreateCourseLayout formId="/courses/create/settings">
          {page}
        </CreateCourseLayout>
      </MainLayout>
    </ScaffoldLayout>
  );
};

export default CreateCourseContent;
