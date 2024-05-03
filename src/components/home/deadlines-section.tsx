import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { BiChevronRight, BiSolidWatch, BiTimer } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { DeadlineItem, DeadlineItemSkeleton } from "./deadline-item";

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
  const { data: session, status } = useSession();
  const isLoading = status === "loading" || !session?.user;
  const isEmpty = false;

  return (
    <section className="grid grid-rows-[auto_auto_1fr] rounded-lg border bg-background px-4 py-3 shadow">
      <header className="flex items-center gap-2 pb-3">
        <BiTimer className="text-xl" />
        <h4 className="flex-grow text-lg font-semibold">Дедлайны</h4>
        <Button variant="outline" type="button" asChild className="gap-1">
          <Link href="#">
            <span>Смотреть все</span>
            <BiChevronRight className="text-xl" />
          </Link>
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
          className={cn("custom-scrollbar h-full space-y-1 overflow-auto", {
            "max-h-[16rem] min-[1120px]:max-h-[11.75rem]": !isEmpty,
          })}
        >
          {!isLoading ? (
            !isEmpty ? (
              <>
                <DeadlineItem
                  title="Лабораторная работа #1"
                  course="Иностранный язык в профессиональной деятельности"
                  date={new Date("5/30/2024")}
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
