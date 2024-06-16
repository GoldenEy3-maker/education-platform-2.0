import { type LessionType, type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { BiBook, BiHelpCircle, BiMap } from "react-icons/bi";
import { cn, getPersonInitials } from "~/libs/utils";
import { Avatar } from "../avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const LessionTypeContentMap: Record<LessionType, string> = {
  Lab: "Лабораторная",
  Lec: "Лекция",
  Pract: "Практическая",
} as const;

type ScheduleItemProps = {
  index: number;
} & Prisma.LessionGetPayload<{
  include: {
    pavilion: true;
    teacher: {
      select: {
        name: true;
        fathername: true;
        status: true;
        surname: true;
      };
    };
  };
}> &
  React.ComponentProps<"div">;

const ScheduleItemsMainClrHMap: Record<number, string> = {
  0: "24",
  1: "220",
  2: "248",
  3: "107",
  4: "178",
  5: "300",
  6: "340",
  7: "63",
  8: "132",
  9: "206",
  10: "276",
};

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  title,
  start,
  end,
  teacher,
  classRoom,
  pavilion,
  pavilionId,
  type,
  status,
  index,
  className,
  ...props
}) => {
  return (
    <div
      style={
        {
          "--main-clr-h": ScheduleItemsMainClrHMap[index],
        } as React.CSSProperties
      }
      className={cn(
        `rounded-lg bg-[linear-gradient(180deg,hsla(var(--main-clr-h),70%,93%,1)_60%,hsla(var(--main-clr-h),70%,93%,.4)_100%)] p-4 dark:bg-[linear-gradient(180deg,hsla(var(--main-clr-h),70%,10%,1)_60%,hsla(var(--main-clr-h),70%,10%,.4)_100%)]`,
        className,
      )}
      {...props}
    >
      <header>
        <h4 className="font-medium text-[hsla(var(--main-clr-h),60%,15%)] dark:text-[hsla(var(--main-clr-h),70%,93%)]">
          {title}
        </h4>
        <span className="mt-1 block text-[hsla(var(--main-clr-h),60%,15%,.8)] dark:text-[hsla(var(--main-clr-h),70%,93%,.8)]">
          {dayjs(start).format("HH:mm")} - {dayjs(end).format("HH:mm")},{" "}
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <Link
                href="#"
                className="cursor-pointer text-[hsla(var(--main-clr-h),60%,15%,.8)] underline-offset-4 hover:text-foreground hover:underline data-[state=open]:text-foreground data-[state=open]:underline dark:text-[hsla(var(--main-clr-h),70%,93%,.8)]"
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
                className="cursor-pointer text-[hsla(var(--main-clr-h),60%,15%,.8)] underline-offset-4 hover:text-foreground hover:underline data-[state=open]:text-foreground data-[state=open]:underline dark:text-[hsla(var(--main-clr-h),70%,93%,.8)]"
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
            <span className="text-[hsla(var(--main-clr-h),60%,15%,.8)] dark:text-[hsla(var(--main-clr-h),70%,93%,.8)]">
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
        <span className="rounded-full border border-[hsla(var(--main-clr-h),60%,45%)] px-4 py-1 text-sm text-[hsla(var(--main-clr-h),60%,45%)] dark:border-[hsla(var(--main-clr-h),70%,60%)] dark:text-[hsla(var(--main-clr-h),70%,60%)]">
          {LessionTypeContentMap[type]}
        </span>
      </footer>
    </div>
  );
};

export const ScheduleItemSkeleton: React.FC = () => {
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
