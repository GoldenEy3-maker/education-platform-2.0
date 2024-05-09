import { CreateCourseLayout } from "~/layouts/create-course";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const CreateCourseSettings: NextPageWithLayout = () => {
  return <div>CreateCourseSettings</div>;
};

CreateCourseSettings.getLayout = (page) => {
  return (
    <ScaffoldLayout>
      <MainLayout>
        <CreateCourseLayout>{page}</CreateCourseLayout>
      </MainLayout>
    </ScaffoldLayout>
  );
};

export default CreateCourseSettings;
