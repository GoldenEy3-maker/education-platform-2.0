import Link from "next/link";
import {
  BiBarChartSquare,
  BiBook,
  BiCalendar,
  BiHelpCircle,
  BiNote,
  BiNotepad,
  BiTachometer,
  BiTimer,
} from "react-icons/bi";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "./_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <main className="grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-4">
      <section className="rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <header className="flex items-center gap-2 pb-3">
          <BiTachometer className="text-xl" />
          <h4 className="flex-grow text-lg font-medium">Дедлайны</h4>
          <Button variant="outline" type="button" asChild>
            <Link href="#">Смотреть все</Link>
          </Button>
        </header>
        <Separator />
      </section>
      <section className="rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <header className="flex items-center gap-2 pb-3">
          <BiBook className="text-xl" />
          <h4 className="flex-grow text-lg font-medium">Курсы</h4>
          <Button variant="outline" type="button" asChild>
            <Link href="#">Смотреть все</Link>
          </Button>
        </header>
        <Separator />
      </section>
      <section className="row-span-2 rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <header className="flex items-center gap-2 pb-3">
          <BiCalendar className="text-xl" />
          <h4 className="flex-grow text-lg font-medium">Расписание</h4>
          <Button variant="outline" type="button" asChild>
            <Link href="#">Смотреть все</Link>
          </Button>
        </header>
        <Separator />
      </section>
      <section className="col-start-1 row-start-2 rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <header className="flex items-center gap-2 pb-3">
          <BiBarChartSquare className="text-xl" />
          <h4 className="flex-grow text-lg font-medium">Успеваемость</h4>
          <Button variant="outline" type="button" asChild>
            <Link href="#">Смотреть все</Link>
          </Button>
        </header>
        <Separator />
      </section>
      <section className="col-start-2 row-start-2 rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <header className="flex items-center gap-2 pb-3">
          <BiHelpCircle className="text-xl" />
          <h4 className="flex-grow text-lg font-medium">
            Не знаешь с чего начать?
          </h4>
          <div className="h-10" />
        </header>
        <Separator />
        <div className="mt-4">
          <iframe
            className="rounded-md"
            width="100%"
            height="315"
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
