import {
  Attempt,
  type Prisma,
  type TaskAttachment,
  type TaskType,
} from "@prisma/client";
import { TabsList } from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import FlipNumbers from "react-flip-numbers";
import {
  BiBarChart,
  BiCalendar,
  BiCog,
  BiDotsVerticalRounded,
  BiExpandVertical,
  BiFilterAlt,
  BiPaperclip,
  BiRevision,
  BiRightArrowAlt,
  BiSearch,
  BiSolidNotepad,
  BiSortAlt2,
  BiStopwatch,
  BiTimeFive,
} from "react-icons/bi";
import { useInterval } from "usehooks-ts";
import { cn, type ValueOf } from "~/libs/utils";
import { CourseEmptyTab } from "./course-empty-tab";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

const SortValueTasksMap = {
  Recent: "Recent",
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const SortValueTasksContentMap: Record<SortValueTasksMap, string> = {
  Recent: "Недавним",
  Alphabet: "Алфавиту",
  Progress: "Прогрессу",
} as const;

export type SortValueTasksMap = ValueOf<typeof SortValueTasksMap>;

const FiltersTasksMap = {
  HideCompleted: "HideCompleted",
  HideLectures: "HideLectures",
  HideTests: "HideTests",
  HideLabs: "HideLabs",
} as const;

export type FiltersTasksMap = ValueOf<typeof FiltersTasksMap>;

const FiltersTasksContentMap: Record<FiltersTasksMap, string> = {
  HideCompleted: "Скрыть завершенные",
  HideLectures: "Скрыть лекции",
  HideTests: "Скрыть тесты",
  HideLabs: "Скрыть лабораторные",
};

const TaskTypeContentMap: Record<TaskType, string> = {
  Lec: "Лекция",
  Test: "Тест",
  Pract: "Практическая",
};

type TasksItemProps = {
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

const TaskItem: React.FC<TasksItemProps> = (props) => {
  const { availableTime, startDateTime } = props;

  const isTimer = availableTime && startDateTime && props.type === "Test";

  const [timeLeft, setTimeLeft] = useState(() => {
    if (isTimer) {
      return dayjs.duration(
        Math.max(
          availableTime -
            (dayjs(new Date()).valueOf() - dayjs(startDateTime).valueOf()),
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
      <h3 className="mb-1 mt-3 text-lg font-medium">{props.title}</h3>
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
            if (props.type === "Test")
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
            const diffDays = dayjs(props.deadline).diff(new Date(), "d");

            return (
              <div
                className={cn("flex items-center gap-2", {
                  "text-destructive": diffDays < 0,
                })}
              >
                <BiTimeFive className="text-xl" />
                <span className={cn({ "text-sm": diffDays < 0 })}>
                  {diffDays < 0
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

const TaskItemSkeleton: React.FC = () => {
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

type CourseTasksTabProps = {
  tasks: Prisma.TaskGetPayload<{
    include: {
      attachments: true;
      restrictedGroups: true;
      restrictedUsers: true;
      attempts: {
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
      };
    };
  }>[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  sortValue: SortValueTasksMap;
  onSortValueChange: (value: SortValueTasksMap) => void;
  filters: Record<FiltersTasksMap, boolean>;
  onFiltersChange: (key: FiltersTasksMap) => void;
  isLoading: boolean;
  isAuthor: boolean;
  isSubStudent: boolean;
  isTeacher: boolean;
};

export const CourseTasksTab: React.FC<CourseTasksTabProps> = ({
  tasks,
  searchValue,
  onSearchValueChange,
  sortValue,
  onSortValueChange,
  filters,
  onFiltersChange,
  isAuthor,
  isLoading,
  isSubStudent,
  isTeacher,
}) => {
  const { data: session } = useSession();

  const activeFilters = Object.values(filters).filter((val) => val === true);

  const groupTasksBySection = (entrie: typeof tasks) => {
    const firstTask = entrie[0];

    if (!firstTask) return [];

    const newTasks = entrie
      .slice(1)

      .reduce(
        (acc, task) => {
          const lastTasks = acc.at(-1)!;
          const lastTask = lastTasks.at(-1)!;

          if (task.section === lastTask.section) {
            lastTasks.push(task);
            acc[acc.length - 1] = lastTasks;
          } else {
            acc.push([task]);
          }

          return acc;
        },
        [[firstTask]],
      );

    const groups = newTasks.reduce<Record<string, typeof tasks>>(
      (acc, section) => {
        const lastSectionTask = section.at(-1)!;

        acc[lastSectionTask.section] = section;
        return acc;
      },
      {},
    );

    return groups;
  };

  if (tasks.length === 0)
    return (
      <CourseEmptyTab
        icon={<BiSolidNotepad className="text-7xl text-muted-foreground" />}
        text={
          isAuthor ? (
            <p>
              Похоже, что на вашем курсе все еще нет заданий.{" "}
              <Link href="#" className="text-primary">
                Давайте создадим новое вместе
              </Link>
              . В случае, если вы уже это сделали, но тут ничего не появилось,
              тогда проблема остается на нашей стороне. Попробуйте вернуться
              позже. Мы вас всегда ждем!
            </p>
          ) : (
            <p>
              Похоже, что на курсе еще нет заданий. Есть риск проблем с сервером
              на нашей стороне. Либо в скором времени преподаватель опубликует
              тут новый материал. В любом случае, оставайтесь на связи и
              попробуйте вернуться позже. Мы вас всегда ждем!
            </p>
          )
        }
      />
    );

  return (
    <div>
      <div className="mb-4 grid grid-cols-[1fr_repeat(2,minmax(0,auto))] items-center gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск заданий..."
          className="max-w-64"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={!session?.user}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 max-[1100px]:h-10 max-[1100px]:w-10 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:shadow-none"
              disabled={!session?.user}
            >
              <BiFilterAlt className="shrink-0 text-xl" />
              <span className="max-[1100px]:hidden">Фильтры</span>
              <span
                className={cn(
                  "flex h-6 min-w-6 items-center justify-center rounded-full border px-1.5 text-sm text-muted-foreground max-[1100px]:hidden",
                  {
                    "border-primary bg-primary text-primary-foreground":
                      activeFilters.length > 0,
                  },
                )}
              >
                {activeFilters.length}
              </span>
              {activeFilters.length > 0 ? (
                <Badge className="absolute right-0 top-0 h-5 min-w-5 justify-center rounded-full px-1.5 py-0 text-xs min-[1100px]:hidden">
                  {activeFilters.length}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Фильтры</h4>
              <p className="text-sm text-muted-foreground">
                Параметры отображения заданий.
              </p>
            </div>
            <Separator className="my-2" />
            <div className="space-y-1">
              {Object.entries(FiltersTasksContentMap).map(([key, value]) => (
                <Button
                  key={key}
                  asChild
                  variant="ghost"
                  className="w-full cursor-pointer justify-between gap-3"
                  onClick={() => onFiltersChange(key as FiltersTasksMap)}
                >
                  <div>
                    <Label htmlFor={key} className="pointer-events-none">
                      {value}
                    </Label>
                    <Switch
                      id={key}
                      checked={filters[key as FiltersTasksMap]}
                    />
                  </div>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Select
          defaultValue={SortValueTasksMap.Recent}
          value={sortValue}
          onValueChange={onSortValueChange}
        >
          <Button
            asChild
            variant="outline"
            className="w-auto justify-between gap-2 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
            disabled={!session?.user}
          >
            <SelectTrigger>
              <BiSortAlt2 className="shrink-0 text-xl min-[1100px]:hidden" />
              <p className="max-[1100px]:hidden">
                <span className="text-muted-foreground">Сортировать по</span>
                &nbsp;
                <SelectValue />
              </p>
            </SelectTrigger>
          </Button>
          <SelectContent>
            {Object.entries(SortValueTasksContentMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {!isLoading ? (
          Object.entries(
            groupTasksBySection(
              tasks.filter((task) => {
                const value = searchValue.toUpperCase().trim();

                return (
                  task.section.toUpperCase().trim().includes(value) ||
                  task.title.toUpperCase().trim().includes(value) ||
                  TaskTypeContentMap[task.type]
                    .toUpperCase()
                    .trim()
                    .includes(value) ||
                  dayjs(task.createdAt)
                    .format("DD MMM YYYY")
                    .toUpperCase()
                    .trim()
                    .includes(value) ||
                  dayjs(task.createdAt)
                    .toISOString()
                    .toUpperCase()
                    .trim()
                    .includes(value) ||
                  dayjs(task.createdAt)
                    .toString()
                    .toUpperCase()
                    .trim()
                    .includes(value)
                );
              }),
            ),
          ).map(([section, tasks]) => (
            <Collapsible defaultOpen key={section}>
              <CollapsibleTrigger asChild>
                <Button
                  className="h-auto w-full justify-between gap-2 whitespace-normal border-b"
                  variant="ghost"
                >
                  <p className="text-left text-base font-medium">{section}</p>
                  <BiExpandVertical className="shrink-0 text-sm" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      createdAt={task.createdAt}
                      id={task.id}
                      isAuthor={isAuthor}
                      isSubStudent={isSubStudent}
                      isTeacher={isTeacher}
                      title={task.title}
                      type={task.type}
                      attempts={task.attempts}
                      availableAttempts={task.availableAttempts}
                      attachments={task.attachments}
                      availableTime={task.availableTime}
                      startDateTime={task.attempts.at(-1)?.startedAt}
                      totalStep={5}
                      currentStep={2}
                      isViewRestrictions={
                        task.restrictedGroups.length > 0 ||
                        task.restrictedUsers.length > 0
                      }
                      isHidden={task.isHidden}
                      deadline={task.deadline}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <div>
            <div className="px-4 py-2">
              <Skeleton className="h-6 w-64 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-4">
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
              <TaskItemSkeleton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};