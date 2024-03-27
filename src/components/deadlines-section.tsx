import { cva } from "class-variance-authority";
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import {
  BiSolidCheckCircle,
  BiSolidTimeFive,
  BiSolidWatch,
  BiSolidXCircle,
  BiTimer,
} from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

type ProgressIndicatorProps = {
  total: number;
  completed: number;
  isLoading: boolean;
};

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  total,
  completed,
  isLoading,
}) => {
  const value = (completed / total) * 100;
  const radius = 100;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = ((100 - value) / 100) * (Math.PI * radius);

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="origin-center"
        width="13rem"
        height="6rem"
        viewBox="120 56 240 112"
      >
        <circle
          fill="none"
          className="stroke-muted"
          cx={240}
          cy={178}
          strokeWidth={20}
          r={radius}
        ></circle>
        {!isLoading ? (
          <circle
            fill="none"
            className="stroke-primary"
            strokeLinecap="round"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            cx={240}
            cy={178}
            strokeWidth={20}
            r={radius}
          ></circle>
        ) : null}
      </svg>
      {!isLoading ? (
        <div className="absolute inset-x-0 bottom-0 text-center leading-3">
          <span className="text-4xl font-medium">{completed}</span>
          <p className="text-muted-foreground">из {total}</p>
        </div>
      ) : null}
    </div>
  );
};

type DeadlineItemVariant = "warning" | "destructive" | "useful";

type DeadlineItemProps = {
  title: string;
  date: Date;
  course: string;
  isCompleted?: boolean;
};

const DeadlineItemIconMap = {
  warning: BiSolidTimeFive,
  destructive: BiSolidXCircle,
  useful: BiSolidCheckCircle,
};

const deadlineItemIconVariants = cva("row-span-2 text-xl", {
  variants: {
    variant: {
      warning: "text-warning",
      destructive: "text-destructive",
      useful: "text-useful",
    },
  },
});

const DeadlineItemBadgeMap = {
  warning: "В процессе",
  useful: "Выполнено",
  destructive: "Просрочено",
};

const deadlineItemBadgeVariants = cva("rounded-full", {
  variants: {
    variant: {
      warning: "bg-warning/30 text-warning-foreground hover:bg-warning/60",
      useful: "bg-useful/30 text-useful-foreground hover:bg-useful/60",
      destructive:
        "bg-destructive/30 text-destructive-foreground hover:bg-destructive/60",
    },
  },
});

const DeadlineItem: React.FC<DeadlineItemProps> = ({
  title,
  date,
  course,
  isCompleted,
}) => {
  const dateDiff = dayjs(date).diff(new Date());
  const variant: DeadlineItemVariant = isCompleted
    ? "useful"
    : dateDiff > 0
      ? "warning"
      : "destructive";

  const Icon = DeadlineItemIconMap[variant];

  return (
    <Button
      asChild
      variant="ghost"
      className="grid h-auto w-full grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] justify-normal gap-x-3 text-left"
    >
      <Link href="#">
        <Icon className={cn(deadlineItemIconVariants({ variant }))} />
        <p className="truncate text-base">
          {`${title}${variant === "warning" ? " (" + dayjs(date).fromNow(true) + ")" : ""}`}
        </p>
        <span className="col-start-2 row-start-2 truncate text-muted-foreground">
          {course}
        </span>
        <div className="row-span-2 flex items-center justify-center">
          <Badge className={cn(deadlineItemBadgeVariants({ variant }))}>
            {DeadlineItemBadgeMap[variant]}
          </Badge>
        </div>
      </Link>
    </Button>
  );
};

const DeadlineItemSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 gap-y-2 px-4 py-2">
      <Skeleton className="row-span-2 h-11 w-11 rounded-full" />
      <Skeleton className="h-3 w-40 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
};

const DeadlinesEmpty: React.FC = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <BiSolidWatch className="text-7xl text-muted-foreground" />
      <p className="text-center [text-wrap:balance]">
        Тут вы сможете видеть свой прогресс выполнения срочных заданий.
      </p>
    </div>
  );
};

export const DeadlinesSection: React.FC = () => {
  const isLoading = false;
  const isEmpty = false;

  return (
    <section className="grid grid-rows-[auto_auto_1fr] rounded-lg border bg-background/95 px-4 py-3 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <header className="flex items-center gap-2 pb-3">
        <BiTimer className="text-xl" />
        <h4 className="flex-grow text-lg font-medium">Дедлайны</h4>
        <Button variant="outline" type="button" asChild>
          <Link href="#">Смотреть все</Link>
        </Button>
      </header>
      <Separator />
      <div className="mt-3">
        {!isEmpty ? (
          <>
            <ProgressIndicator
              completed={16}
              total={20}
              isLoading={isLoading}
            />
            <Separator className="mb-2 mt-3" />
          </>
        ) : null}
        <div
          className={cn("h-full space-y-1 overflow-auto", {
            "max-h-[16rem] min-[1120px]:max-h-[11.75rem]": !isEmpty,
          })}
        >
          {!isLoading ? (
            !isEmpty ? (
              <>
                <DeadlineItem
                  title="Лабораторная работа #1"
                  course="Иностранный язык в профессиональной деятельности"
                  date={new Date("4/20/2024")}
                />
                <DeadlineItem
                  title="Лабораторная работа #1"
                  course="Иностранный язык в профессиональной деятельности"
                  date={new Date("3/26/2024")}
                  isCompleted
                />
                <DeadlineItem
                  title="Лабораторная работа #1"
                  course="Иностранный язык в профессиональной деятельности"
                  date={new Date("3/26/2024")}
                />
              </>
            ) : (
              <DeadlinesEmpty />
            )
          ) : (
            <>
              <DeadlineItemSkeleton />
              <DeadlineItemSkeleton />
              <DeadlineItemSkeleton />
            </>
          )}
        </div>
      </div>
    </section>
  );
};
