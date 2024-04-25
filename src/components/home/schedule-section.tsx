import {
  type Lession,
  LessionType,
  type Pavilion,
  type Prisma,
} from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BiCalendar,
  BiChevronLeft,
  BiChevronRight,
  BiSolidBookBookmark,
  BiSolidDetail,
  BiSolidFlask,
  BiSolidWidget,
} from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScheduleItem, ScheduleItemSkeleton } from "./shedule-item";

const TabsMap = {
  All: "All",
  ...LessionType,
} as const;

type TabsMapKeys = keyof typeof TabsMap;

const MOK_PAVILION_DATA: Pavilion[] = [
  {
    id: "pavilion_1",
    address: "пр-т Ленина, 61",
    infoLink: "",
    mapLink: "",
    name: `Корпус "М"`,
  },
];

const MOK_DATA: Prisma.LessionGetPayload<{
  include: {
    pavilion: true;
    teacher: {
      select: { name: true; surname: true; fathername: true; status: true };
    };
  };
}>[] = [
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 13:20"),
    end: new Date("03/31/2024 14:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Высшая математика",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    // classRoom: 203,
    // pavilion: MOK_PAVILION_DATA[0]!,
    classRoom: null,
    pavilion: null,
    pavilionId: null,
    start: new Date("03/31/2024 9:40"),
    end: new Date("03/31/2024 11:10"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Психология",
    type: "Pract",
    status: "Async",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: null,
    pavilion: null,
    pavilionId: null,
    start: new Date("03/31/2024 8:00"),
    end: new Date("03/31/2024 9:30"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "История",
    type: "Pract",
    status: "Sync",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
  {
    id: crypto.randomUUID(),
    classRoom: 203,
    pavilion: MOK_PAVILION_DATA[0]!,
    pavilionId: MOK_PAVILION_DATA[0]!.id,
    start: new Date("03/31/2024 11:20"),
    end: new Date("03/31/2024 12:50"),
    teacher: {
      fathername: "Михайловна",
      name: "Любовь",
      surname: "Демкина",
      status: "Преподаватель английского языка",
    },
    teacherId: "teacher_1",
    title: "Иностранный язык в профессиональной деятельности",
    type: "Lab",
    status: "Full",
    groupId: "123",
  },
];

type LessionsEmptyProps = {
  icon: React.ReactNode;
  text: string;
};

const LessionsEmpty: React.FC<LessionsEmptyProps> = ({ icon, text }) => {
  return (
    <div className="flex h-full min-h-[25rem] flex-col items-center justify-center min-[1120px]:min-h-[25rem] 2xl:min-h-[calc(100vh-24rem)]">
      {icon}
      <p className="mt-2 text-center">{text}</p>
    </div>
  );
};

const EmptyDataMap: Record<TabsMapKeys, React.ReactNode> = {
  All: (
    <LessionsEmpty
      icon={<BiSolidDetail className="text-7xl text-muted-foreground" />}
      text="На этот день у вас не запланировано занятий."
    />
  ),
  Lec: (
    <LessionsEmpty
      icon={<BiSolidBookBookmark className="text-7xl text-muted-foreground" />}
      text="На этот день у вас не запланировано лекций."
    />
  ),
  Lab: (
    <LessionsEmpty
      icon={<BiSolidFlask className="text-7xl text-muted-foreground" />}
      text="На этот день у вас не запланировано лабораторных."
    />
  ),
  Pract: (
    <LessionsEmpty
      icon={<BiSolidWidget className="text-7xl text-muted-foreground" />}
      text="На этот день у вас не запланировано практических."
    />
  ),
};

const TabsTriggerMap: Record<
  TabsMapKeys,
  { icon: React.ReactNode; text: string }
> = {
  All: {
    icon: (
      <BiSolidDetail className="shrink-0 text-xl group-data-[state=active]:text-primary" />
    ),
    text: "Все",
  },
  Lec: {
    icon: (
      <BiSolidBookBookmark className="shrink-0 text-xl group-data-[state=active]:text-primary" />
    ),
    text: "Лекции",
  },
  Lab: {
    icon: (
      <BiSolidFlask className="shrink-0 text-xl group-data-[state=active]:text-primary" />
    ),
    text: "Лаб",
  },
  Pract: {
    icon: (
      <BiSolidWidget className="shrink-0 text-xl group-data-[state=active]:text-primary" />
    ),
    text: "Практ",
  },
};

export const ScheduleSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const isLoading = false;

  // useEffect(() => {
  //   setIsLoading(true);
  //   getLessionsPromise(currentDate.toDate())
  //     .then((data) => setData(data))
  //     .catch((err) => console.error(err))
  //     .finally(() => setIsLoading(false));
  // }, [currentDate]);

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

  const sortLessionsFn = (a: Lession, b: Lession) =>
    +a.start.getTime() - +b.start.getTime();

  const lecLessions = MOK_DATA.filter((lession) => lession.type === "Lec");
  const labLessions = MOK_DATA.filter((lession) => lession.type === "Lab");
  const practLessions = MOK_DATA.filter((lession) => lession.type === "Pract");

  const DataMap: Record<TabsMapKeys, typeof MOK_DATA> = {
    All: MOK_DATA,
    Lec: lecLessions,
    Lab: labLessions,
    Pract: practLessions,
  };

  return (
    <section className="z-10 row-span-2 grid grid-rows-[auto_auto_1fr] rounded-lg border bg-background px-4 py-3 shadow">
      <header className="flex items-center gap-2 overflow-hidden pb-3">
        <BiCalendar className="text-xl" />
        <h4 className="flex-grow truncate text-lg font-semibold">Расписание</h4>
        <Button variant="outline" type="button" asChild className="gap-2">
          <Link href="#">
            <span>Смотреть все</span>
            <BiChevronRight className="text-xl" />
          </Link>
        </Button>
      </header>
      <Separator />
      <div className="mt-3 grid grid-rows-[auto_auto_1fr]">
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
          <span className="font-medium capitalize">
            {currentDate.format("MMMM, YYYY")}
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
          <div className="grid grid-cols-3 items-center gap-1 xs:grid-cols-5">
            {comingDays.map((date) => {
              const isCurrentDate = date.isSame(currentDate);
              const isRealDate = date.isSame(dayjs(), "d");

              return (
                <Button
                  key={date.valueOf()}
                  type="button"
                  variant={isCurrentDate ? "default" : "ghost"}
                  className={cn(
                    "h-auto flex-col transition-none first:max-xs:hidden last:max-xs:hidden",
                    {
                      "outline outline-input": isRealDate,
                    },
                  )}
                  onClick={() => setCurrentDate(date)}
                >
                  <span
                    className={cn("text-sm text-muted-foreground", {
                      "text-primary-foreground": isCurrentDate,
                    })}
                  >
                    {date.format("dd")}
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
        <Tabs defaultValue={TabsMap.All} className="mt-4 overflow-hidden">
          <TabsList className="hidden-scrollbar mb-2 flex h-auto justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
            {Object.entries(TabsMap).map(([key, value]) => (
              <TabsTrigger
                key={key}
                className="group h-auto shrink-0 grow gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
                value={value}
                asChild
                disabled={isLoading}
              >
                <Button type="button" variant="ghost">
                  {TabsTriggerMap[key as TabsMapKeys].icon}
                  {TabsTriggerMap[key as TabsMapKeys].text}
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(TabsMap).map(([key, value]) => (
            <TabsContent
              key={key}
              value={value}
              className="custom-scrollbar h-full max-h-[25rem] space-y-2 overflow-auto min-[1120px]:max-h-[25rem] 2xl:max-h-[calc(100vh-24rem)]"
            >
              {!isLoading ? (
                DataMap[key as TabsMapKeys].length > 0 ? (
                  DataMap[key as TabsMapKeys]
                    .sort(sortLessionsFn)
                    .map((lession, index) => (
                      <ScheduleItem
                        key={lession.id}
                        index={index}
                        {...lession}
                      />
                    ))
                ) : (
                  EmptyDataMap[key as TabsMapKeys]
                )
              ) : (
                <>
                  <ScheduleItemSkeleton />
                  <ScheduleItemSkeleton />
                  <ScheduleItemSkeleton />
                  <ScheduleItemSkeleton />
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
