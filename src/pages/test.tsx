import React from "react";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const TestPage: NextPageWithLayout = () => {
  return null;
};

TestPage.getLayout = (page) => <ScaffoldLayout>{page}</ScaffoldLayout>;

export default TestPage;
