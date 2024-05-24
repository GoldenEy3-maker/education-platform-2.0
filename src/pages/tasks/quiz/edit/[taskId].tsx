import React from "react";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const EditQuizPage: NextPageWithLayout = () => {
  return <main>EditQuizPage</main>;
};

EditQuizPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default EditQuizPage;
