import React from "react";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const CreatePractPage: NextPageWithLayout = () => {
  return <main>CreatePractPage</main>;
};

CreatePractPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CreatePractPage;
