import React from "react";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "~/pages/_app";

const PractPage: NextPageWithLayout = () => {
  return <main>PractPage</main>;
};

PractPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default PractPage;
