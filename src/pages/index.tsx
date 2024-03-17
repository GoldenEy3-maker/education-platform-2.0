import { Spinner } from "~/components/spinner";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <main className="grid min-h-svh place-items-center text-5xl">
      <Spinner />
    </main>
  );
};

HomePage.getLayout = (page) => <ScaffoldLayout>{page}</ScaffoldLayout>;

export default HomePage;
