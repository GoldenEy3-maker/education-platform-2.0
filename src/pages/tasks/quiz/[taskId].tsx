import React from "react";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const QuizPage: NextPageWithLayout = () => {
  return <main>QuizPage</main>;
};

QuizPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default QuizPage;
