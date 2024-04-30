import {
  type Prisma,
  type TaskAttachment,
  type TaskType,
} from "@prisma/client";
import { cva } from "class-variance-authority";
import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import FlipNumbers from "react-flip-numbers";
import {
  BiBarChart,
  BiCalendar,
  BiCog,
  BiDotsVerticalRounded,
  BiPaperclip,
  BiRevision,
  BiRightArrowAlt,
  BiStopwatch,
  BiTimeFive,
} from "react-icons/bi";
import { useInterval } from "usehooks-ts";
import { TaskTypeContentMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";

type TaskItemProps = {
  id: string;
  isAuthor: boolean;
  isTeacher: boolean;
  isSubStudent: boolean;
  createdAt: Date;
  type: TaskType;
  title: string;
  attempts?: Prisma.AttemptGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          group: true;
          image: true;
          name: true;
          surname: true;
          fathername: true;
        };
      };
    };
  }>[];
  availableAttempts?: number | null;
  attachments?: TaskAttachment[];
  totalStep?: number;
  currentStep?: number;
  isHidden?: boolean;
  isViewRestrictions?: boolean;
  startDateTime?: Date;
  availableTime?: number | null;
  deadline?: Date | null;
};

const taskItemBadgeVariants = cva<{ type: Record<TaskType, string> }>(
  "w-fit rounded-full bg-primary/10 text-primary px-4 py-1 text-sm ",
  {
    variants: {
      type: {
        Test: "bg-[hsl(260_56%_50%_/_.1)] text-[hsl(260_56%_50%)] dark:bg-[hsl(260_92%_80%_/_.1)] dark:text-[hsl(260_92%_80%)]",
        Lec: "bg-[hsl(26_85%_45%_/_.1)] text-[hsl(26_85%_45%)] dark:bg-[hsl(26_85%_60%_/_.1)] dark:text-[hsl(26_85%_60%)]",
        Pract:
          "bg-[hsl(171_60%_40%_/_.1)] text-[hsl(171_60%_40%)] dark:bg-[hsl(171_60%_60%_/_.1)] dark:text-[hsl(171_60%_60%)]",
      },
    },
  },
);

export const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { availableTime, startDateTime } = props;

  const isTimer = availableTime && startDateTime && props.type === "Test";

  const [timeLeft, setTimeLeft] = useState(() => {
    if (isTimer) {
      return dayjs.duration(
        Math.max(
          availableTime - (dayjs().valueOf() - dayjs(startDateTime).valueOf()),
          0,
        ),
      );
    }

    return undefined;
  });

  useInterval(
    () => setTimeLeft((prev) => prev?.subtract({ seconds: 1 })),
    timeLeft && timeLeft.milliseconds() > 0 ? 1000 : null,
  );

  return (
    <div className="relative flex flex-col rounded-md border bg-background p-4 shadow-sm">
      {props.isAuthor ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full data-[state=open]:bg-accent"
            >
              <BiDotsVerticalRounded className="text-xl" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start">
                <BiBarChart className="mr-2 text-xl" />
                <span>Результаты</span>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start">
                <BiCog className="mr-2 text-xl" />
                <span>Параметры</span>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      <span className={cn(taskItemBadgeVariants({ type: props.type }))}>
        {TaskTypeContentMap[props.type]}
      </span>
      <h4 className="mb-1 mt-3 text-lg font-medium">{props.title}</h4>
      <div className="mb-1 flex h-9 items-center">
        <div className="mr-2 flex items-center gap-2 text-muted-foreground">
          <BiCalendar className="text-xl" />
          <span className="capitalize">
            {dayjs(props.createdAt).format("DD MMM YYYY")}
          </span>
        </div>
        {props.attachments && props.attachments.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-auto gap-1 px-2 text-muted-foreground"
          >
            <BiPaperclip className="text-lg" />
            <span>{props.attachments.length}</span>
          </Button>
        ) : null}
        {(() => {
          if (
            props.isAuthor &&
            props.type === "Test" &&
            props.availableAttempts
          )
            return (
              <div className="flex h-9 items-center gap-1 px-2 text-sm text-muted-foreground">
                <BiRevision className="text-lg" />
                <span>{props.availableAttempts}</span>
              </div>
            );

          if (!props.isAuthor) {
            if (props.type === "Test" || props.type === "Pract")
              return (
                <Button
                  variant="ghost"
                  className="h-9 gap-1 px-2 text-muted-foreground"
                >
                  <BiRevision className="text-lg" />
                  <span>
                    {props.availableAttempts
                      ? `${props.attempts?.length}/${props.availableAttempts}`
                      : props.attempts?.length}
                  </span>
                </Button>
              );

            if (props.type === "Lec")
              return (
                <Button
                  variant="ghost"
                  className="h-9 gap-1 px-2 text-muted-foreground"
                >
                  <BiRevision className="text-lg" />
                  <span>{props.attempts?.length}</span>
                </Button>
              );
          }

          return null;
        })()}
      </div>
      {(() => {
        if (props.isAuthor)
          return (
            <div
              className={cn(
                "mb-2 flex w-fit items-center gap-2 rounded-full bg-useful/10 px-3 py-1 text-sm text-useful",
                {
                  "bg-destructive/10 text-destructive": props.isHidden,
                  "bg-warning/10 text-warning": props.isViewRestrictions,
                },
              )}
            >
              <div className="flex items-center justify-center">
                <span className="relative flex h-2 w-2">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full animate-ping rounded-full bg-useful opacity-75",
                      {
                        "bg-destructive": props.isHidden,
                        "bg-warning": props.isViewRestrictions,
                      },
                    )}
                  ></span>
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full bg-useful",
                      {
                        "bg-destructive": props.isHidden,
                        "bg-warning": props.isViewRestrictions,
                      },
                    )}
                  ></span>
                </span>
              </div>
              <span>
                {props.isHidden
                  ? "Скрыто"
                  : props.isViewRestrictions
                    ? "Ограничено"
                    : "Открыто"}
              </span>
            </div>
          );

        if (props.type !== "Pract") {
          if (props.isSubStudent && props.currentStep && props.totalStep)
            return (
              <div className="mb-2 flex items-center gap-2">
                <Progress value={(props.currentStep / props.totalStep) * 100} />
                <span className="text-sm text-muted-foreground">
                  {props.currentStep}/{props.totalStep}
                </span>
              </div>
            );

          return (
            <div className="mb-2 flex items-center gap-2">
              <Progress value={0} />
              <span className="text-sm text-muted-foreground">
                0/{props.totalStep}
              </span>
            </div>
          );
        }

        return null;
      })()}
      <footer className="mt-auto flex items-center justify-between gap-2">
        {(() => {
          if (props.deadline) {
            const diff = dayjs(props.deadline).diff();

            return (
              <div
                className={cn("flex items-center gap-2", {
                  "text-destructive": diff <= 0,
                })}
              >
                <BiTimeFive className="text-xl" />
                <span className={cn({ "text-sm": diff <= 0 })}>
                  {diff <= 0
                    ? "Просрочено"
                    : dayjs(props.deadline).fromNow(true)}
                </span>
              </div>
            );
          }

          if (props.type === "Test")
            return (
              <div className="flex items-center gap-2">
                <BiStopwatch className="text-xl" />
                {timeLeft ? (
                  <FlipNumbers
                    width={10}
                    height={16}
                    color=""
                    play
                    numbers={timeLeft.format("HH:mm:ss")}
                  />
                ) : (
                  <span
                    className={cn({
                      "text-sm": !availableTime,
                    })}
                  >
                    {availableTime
                      ? dayjs.duration(availableTime).format("HH:mm:ss")
                      : "Не ограничено"}
                  </span>
                )}
              </div>
            );

          return null;
        })()}

        <Button asChild variant="link" className="gap-2">
          <Link href="#">
            <span>{startDateTime ? "Продолжить" : "Начать"}</span>
            <BiRightArrowAlt className="shrink-0 text-xl" />
          </Link>
        </Button>
      </footer>
    </div>
  );
};

export const TaskItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-md border bg-background p-4 shadow-sm">
      <Skeleton className="h-7 w-32 rounded-full" />
      <Skeleton className="mb-4 mt-3 h-7 w-40 rounded-full" />
      <Skeleton className="mb-5 h-5 w-36 rounded-full" />
      <Skeleton className="mb-2 h-3 w-full rounded-full" />
      <div className="mt-auto flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
};
