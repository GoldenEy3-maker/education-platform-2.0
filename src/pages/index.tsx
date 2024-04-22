import { BiHelpCircle } from "react-icons/bi";
import { CoursesSection } from "~/components/courses-section";
import { DeadlinesSection } from "~/components/deadlines-section";
import { ScheduleSection } from "~/components/schedule-section";
import { Separator } from "~/components/ui/separator";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <main className="grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-4 min-[624px]:grid-cols-[repeat(auto-fit,minmax(25rem,1fr))]">
      <DeadlinesSection />
      <CoursesSection />
      <ScheduleSection />
      <section className="rounded-lg border bg-background px-4 py-3 shadow">
        <header className="flex items-center gap-2 pb-3">
          <BiHelpCircle className="text-xl" />
          <h4 className="flex-grow text-lg font-semibold">
            Не знаешь с чего начать?
          </h4>
          <div className="h-10" />
        </header>
        <Separator />
        <div className="mt-4">
          <iframe
            className="h-[19rem] rounded-md 2xl:h-[calc(100vh-37.5rem)]"
            width="100%"
            src="https://www.youtube.com/embed/j70dL0JZXGI?si=S8Gad7Il1421X1mJ"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </main>
  );
};

HomePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default HomePage;
