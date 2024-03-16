import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
  return <main>Home page</main>;
};

HomePage.getLayout = (page) => <ScaffoldLayout>{page}</ScaffoldLayout>;

export default HomePage;
