import React from "react";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const TaskPage: NextPageWithLayout = () => {
  return <main>TaskPage</main>;
};

TaskPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default TaskPage;
