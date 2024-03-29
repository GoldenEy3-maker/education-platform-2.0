import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BiCalendar,
  BiChevronLeft,
  BiChevronRight,
  BiMap,
  BiSolidBookBookmark,
  BiSolidDetail,
  BiSolidFlask,
  BiSolidWidget,
} from "react-icons/bi";
import { capitalizeFirstLetter, cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TabsMap = {
  All: "all",
  Lecture: "lecture",
  LaboratoryWork: "laboratory-work",
  PracticalLession: "practical-lession",
} as const;

const ScheduleItem: React.FC = () => {
  return (
    <div className="rounded-lg bg-[linear-gradient(180deg,hsla(36,65%,93%,1)_0%,transparent_100%)] p-4 dark:bg-[linear-gradient(180deg,hsla(36,65%,10%,1)_0%,transparent_100%)]">
      <header>
        <h4>Иностранный язык в профессиональной деятельности</h4>
        <span className="mt-1 block text-muted-foreground">8:00 - 9:30</span>
      </header>
      <footer className="flex items-center justify-between gap-2">
        <HoverCard openDelay={200} closeDelay={200}>
          <HoverCardTrigger asChild>
            <span className="cursor-pointer text-muted-foreground underline-offset-4 hover:text-foreground hover:underline data-[state=open]:text-foreground data-[state=open]:underline">
              Корпус &quot;М&quot;
            </span>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
            <div className="flex">
              {/* <Avatar fallback="М" /> */}
              <div className="">
                <h4 className="text-sm font-semibold">Корпус &quot;М&quot;</h4>
                <p className="text-sm">пр-т Ленина, 61</p>
                <Link
                  href="https://2gis.ru/barnaul/firm/70000001081247836/83.775902%2C53.348167?m=83.776398%2C53.347882%2F18.05%2Fp%2F36.27%2Fr%2F-11.02"
                  className="mt-2 flex items-center"
                >
                  <BiMap className="mr-1 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Найти на карте
                  </span>
                </Link>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
        <Button
          asChild
          variant="ghost"
          type="button"
          className="h-auto gap-3 px-2 py-1"
        >
          <Link href="#">
            <Avatar fallback="Д" className="h-9 w-9" />
            <span>Демкина Л. М.</span>
          </Link>
        </Button>
      </footer>
    </div>
  );
};

export const ScheduleSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const isLoading = false;

  const incrementMonth = () => {
    setCurrentDate((date) => date.add(1, "M"));
  };

  const decrementMonth = () => {
    setCurrentDate((date) => date.subtract(1, "M"));
  };

  const incrementDay = () => {
    setCurrentDate((date) => date.add(1, "d"));
  };

  const decrementDay = () => {
    setCurrentDate((date) => date.subtract(1, "d"));
  };

  const comingDays = useMemo(() => {
    const days: dayjs.Dayjs[] = [];

    for (let i = -2; i <= 2; i++) {
      days.push(currentDate.add(i, "d"));
    }

    return days;
  }, [currentDate]);

  return (
    <section className="z-50 row-span-2 rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="flex items-center gap-2 pb-3">
        <BiCalendar className="text-xl" />
        <h4 className="flex-grow text-lg font-medium">Расписание</h4>
        <Button variant="outline" type="button" asChild>
          <Link href="#">Смотреть все</Link>
        </Button>
      </header>
      <Separator />
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 rounded-md bg-secondary p-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hover:bg-secondary-foreground hover:text-background"
            onClick={decrementMonth}
          >
            <BiChevronLeft className="text-xl" />
          </Button>
          <span className="font-medium">
            {capitalizeFirstLetter(currentDate.format("MMMM, YYYY"))}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hover:bg-secondary-foreground hover:text-background"
            onClick={incrementMonth}
          >
            <BiChevronRight className="text-xl" />
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={decrementDay}
          >
            <BiChevronLeft className="text-xl" />
          </Button>
          <div className="grid grid-cols-5 items-center gap-1">
            {comingDays.map((date) => {
              const isCurrentDate = date.isSame(currentDate);
              const isRealDate = date.isSame(dayjs(), "d");

              return (
                <Button
                  key={date.valueOf()}
                  type="button"
                  variant={isCurrentDate ? "default" : "ghost"}
                  className={cn("h-auto flex-col transition-none", {
                    "outline outline-input": isRealDate,
                  })}
                  onClick={() => setCurrentDate(date)}
                >
                  <span
                    className={cn("text-sm text-muted-foreground", {
                      "text-primary-foreground": isCurrentDate,
                    })}
                  >
                    {date.format("ddd")}
                  </span>
                  <p className="text-lg font-medium">{date.format("DD")}</p>
                </Button>
              );
            })}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={incrementDay}
          >
            <BiChevronRight className="text-xl" />
          </Button>
        </div>
        {/* <div className="mt-3">
          <Input
            placeholder="Поиск"
            leadingIcon={<BiSearch className="text-xl" />}
            trailingIcon={<BiFilter className="text-xl" />}
          />
        </div> */}
        <Tabs defaultValue={TabsMap.All} className="mt-4">
          <TabsList className="grid h-auto grid-cols-4 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
              value={TabsMap.All}
              asChild
              disabled={isLoading}
            >
              <Button type="button" variant="ghost">
                <BiSolidDetail className="flex-shrink-0 text-xl group-data-[state=active]:text-primary" />
                Все
              </Button>
            </TabsTrigger>
            <TabsTrigger
              className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
              value={TabsMap.Lecture}
              asChild
              disabled={isLoading}
            >
              <Button type="button" variant="ghost">
                <BiSolidBookBookmark className="flex-shrink-0 text-xl group-data-[state=active]:text-primary" />
                Лекции
              </Button>
            </TabsTrigger>
            <TabsTrigger
              className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
              value={TabsMap.LaboratoryWork}
              asChild
              disabled={isLoading}
            >
              <Button type="button" variant="ghost">
                <BiSolidFlask className="flex-shrink-0 text-xl group-data-[state=active]:text-primary" />
                Лаб
              </Button>
            </TabsTrigger>
            <TabsTrigger
              className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
              value={TabsMap.PracticalLession}
              asChild
              disabled={isLoading}
            >
              <Button type="button" variant="ghost">
                <BiSolidWidget className="flex-shrink-0 text-xl group-data-[state=active]:text-primary" />
                Практ
              </Button>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={TabsMap.All}
            className="custom-scroll max-h-[34rem] space-y-1 overflow-auto"
          >
            <ScheduleItem />
            <ScheduleItem />
            <ScheduleItem />
          </TabsContent>
          <TabsContent value={TabsMap.LaboratoryWork}></TabsContent>
          <TabsContent value={TabsMap.PracticalLession}></TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
