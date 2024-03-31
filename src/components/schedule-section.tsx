import {
  type Lession,
  type LessionStatus,
  LessionType,
  type Pavilion,
  type Prisma,
} from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BiBook,
  BiCalendar,
  BiChevronLeft,
  BiChevronRight,
  BiHelpCircle,
  BiMap,
  BiSolidBook,
  BiSolidBookBookmark,
  BiSolidDetail,
  BiSolidFlask,
  BiSolidWidget,
} from "react-icons/bi";
import {
  capitalizeFirstLetter,
  cn,
  getPersonInitials,
  getRandomInt,
} from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const TabsMap = {
  All: "all",
  Lec: "lec",
  Lab: "lab",
  Pract: "pract",
} as const;

const TranslateLessionTypeMap = {
  [LessionType.Lab]: "Лабораторная",
  [LessionType.Lec]: "Лекция",
  [LessionType.Pract]: "Практическая",
} as const;

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
  },
];

type ScheduleItemProps = {
  title: string;
  start: Date;
  end: Date;
  teacher: Prisma.UserGetPayload<{
    select: { fathername: true; surname: true; name: true; status: true };
  }>;
  classRoom?: number | null;
  pavilion?: Pavilion | null;
  type: LessionType;
  status: LessionStatus;
} & React.ComponentProps<"div">;

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  title,
  start,
  end,
  teacher,
  classRoom,
  pavilion,
  type,
  status,
  className,
  ...props
}) => {
  const randomClrH = useRef(getRandomInt(1, 360));

  return (
    <div
      style={{ "--random-clr-h": randomClrH.current } as CSSProperties}
      className={cn(
        `rounded-lg bg-[linear-gradient(180deg,hsla(var(--random-clr-h),65%,93%,1)_0%,transparent_100%)] p-4 dark:bg-[linear-gradient(180deg,hsla(var(--random-clr-h),65%,10%,1)_0%,transparent_100%)]`,
        className,
      )}
      {...props}
    >
      <header>
        <h4>{title}</h4>
        <span className="mt-1 block text-muted-foreground">
          {dayjs(start).format("HH:mm")} - {dayjs(end).format("HH:mm")},{" "}
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Link
                href="#"
                className="cursor-pointer text-muted-foreground underline-offset-4 hover:text-foreground hover:underline data-[state=open]:text-foreground data-[state=open]:underline"
              >
                {getPersonInitials(
                  teacher.surname,
                  teacher.name,
                  teacher.fathername,
                )}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
              <div className="flex space-x-4">
                <Avatar
                  fallback={teacher.surname.at(0)! + teacher.name.at(0)!}
                />
                <div>
                  <p className="font-semibold">
                    {teacher.surname} {teacher.name} {teacher.fathername}
                  </p>
                  <p className="text-sm">{teacher.status}</p>
                  <Link href="#" className="mt-2 flex items-center">
                    <BiBook className="mr-1 opacity-70" />{" "}
                    <span className="text-xs text-muted-foreground">Курс</span>
                  </Link>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </span>
      </header>
      <footer className="mt-1 flex items-center justify-between gap-2">
        {pavilion ? (
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Link
                href={pavilion.infoLink}
                className="cursor-pointer text-muted-foreground underline-offset-4 hover:text-foreground hover:underline data-[state=open]:text-foreground data-[state=open]:underline"
                target="_blank"
              >
                {pavilion.name}, {classRoom}
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
              <div>
                <h4 className="font-semibold">{pavilion.name}</h4>
                <p className="text-sm">{pavilion.address}</p>
                <Link
                  href={pavilion.mapLink}
                  className="mt-2 flex items-center"
                >
                  <BiMap className="mr-1 opacity-70" />{" "}
                  <span className="text-xs text-muted-foreground">
                    Найти на карте
                  </span>
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <p>
            <span className="text-muted-foreground">
              {status === "Async" ? "Асинхронно" : "Синхронно"}
            </span>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BiHelpCircle className="inline-block text-lg text-primary" />{" "}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="whitespace-pre-wrap text-base">
                    {status === "Async"
                      ? "Асинхронный статус занятия - выполнение задания/изучение\n материала, используя инструментарий портала."
                      : "Синхронный статус занятия - выполнение задания/изучение\n материала, находясь на связи (прямой трансляции) вместе c преподаватем."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </p>
        )}
        <span className="rounded-full border px-4 py-1 text-sm">
          {TranslateLessionTypeMap[type]}
        </span>
      </footer>
    </div>
  );
};

const ScheduleItemSkeleton: React.FC = () => {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-60 rounded-full" />
      <Skeleton className="h-6 w-40 rounded-full" />
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
};

const getLessionsPromise = (date: Date) => {
  return new Promise<typeof MOK_DATA>((res) =>
    setTimeout(
      () =>
        res(
          MOK_DATA.filter((lession) => dayjs(date).isSame(lession.start, "d")),
        ),
      1000,
    ),
  );
};

export const ScheduleSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [data, setData] = useState<typeof MOK_DATA>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getLessionsPromise(currentDate.toDate())
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [currentDate]);

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

  const lecLessions = data.filter((lession) => lession.type === "Lec");
  const labLessions = data.filter((lession) => lession.type === "Lab");
  const practLessions = data.filter((lession) => lession.type === "Pract");

  return (
    <section className="z-10 row-span-2 grid grid-rows-[auto_auto_1fr] rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="flex items-center gap-2 pb-3">
        <BiCalendar className="text-xl" />
        <h4 className="flex-grow text-lg font-medium">Расписание</h4>
        <Button variant="outline" type="button" asChild>
          <Link href="#">Смотреть все</Link>
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
              value={TabsMap.Lec}
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
              value={TabsMap.Lab}
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
              value={TabsMap.Pract}
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
            className="custom-scroll h-full max-h-[34rem] space-y-2 overflow-auto"
          >
            {!isLoading ? (
              data.length > 0 ? (
                data
                  .sort(sortLessionsFn)
                  .map((lession) => (
                    <ScheduleItem key={lession.id} {...lession} />
                  ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <BiSolidDetail className="text-7xl text-muted-foreground" />
                  <p className="mt-2 text-center">
                    На этот день у вас не запланировано занятий.
                  </p>
                </div>
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
          <TabsContent
            value={TabsMap.Lec}
            className="custom-scroll h-full max-h-[34rem] space-y-2 overflow-auto"
          >
            {!isLoading ? (
              lecLessions.length > 0 ? (
                lecLessions
                  .sort(sortLessionsFn)
                  .map((lession) => (
                    <ScheduleItem key={lession.id} {...lession} />
                  ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <BiSolidBook className="text-7xl text-muted-foreground" />
                  <p className="mt-2 text-center">
                    На этот день у вас не запланировано лекций.
                  </p>
                </div>
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
          <TabsContent
            value={TabsMap.Lab}
            className="custom-scroll h-full max-h-[34rem] space-y-2 overflow-auto"
          >
            {!isLoading ? (
              labLessions.length > 0 ? (
                labLessions
                  .sort(sortLessionsFn)
                  .map((lession) => (
                    <ScheduleItem key={lession.id} {...lession} />
                  ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <BiSolidFlask className="text-7xl text-muted-foreground" />
                  <p className="mt-2 text-center">
                    На этот день у вас не запланировано лабораторных.
                  </p>
                </div>
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
          <TabsContent
            value={TabsMap.Pract}
            className="custom-scroll h-full max-h-[34rem] space-y-2 overflow-auto"
          >
            {!isLoading ? (
              practLessions.length > 0 ? (
                practLessions
                  .sort(sortLessionsFn)
                  .map((lession) => (
                    <ScheduleItem key={lession.id} {...lession} />
                  ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <BiSolidWidget className="text-7xl text-muted-foreground" />
                  <p className="mt-2 text-center">
                    На этот день у вас не запланировано практических.
                  </p>
                </div>
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
        </Tabs>
      </div>
    </section>
  );
};
