import { type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import {
  BiExpandVertical,
  BiFilterAlt,
  BiNotepad,
  BiPlus,
  BiSearch,
  BiSortAlt2,
} from "react-icons/bi";
import { PagePathMap, TaskTypeContentMap } from "~/libs/enums";
import { cn, prepareSearchMatching, type ValueOf } from "~/libs/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "../ui/switch";
import { CourseEmptyTab } from "./empty-tab";
import { TaskItem, TaskItemSkeleton } from "./task-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TbBallpen, TbBook2, TbListDetails } from "react-icons/tb";
import { useRouter } from "next/router";

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
  HideLec: "HideLec",
  HideTest: "HideTest",
  HidePract: "HidePract",
} as const;

export type FiltersTasksMap = ValueOf<typeof FiltersTasksMap>;

const FiltersTasksContentMap: Record<FiltersTasksMap, string> = {
  HideCompleted: "Скрыть завершенные",
  HideLec: "Скрыть лекции",
  HideTest: "Скрыть тесты",
  HidePract: "Скрыть практические",
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
  const router = useRouter();
  const activeFilters = Object.values(filters).filter((val) => val === true);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const value = prepareSearchMatching(searchValue);
        const creatdAt = dayjs(task.createdAt);
        const section = prepareSearchMatching(task.section);
        const title = prepareSearchMatching(task.title);
        const type = prepareSearchMatching(TaskTypeContentMap[task.type]);
        const formatedCreatedAt = prepareSearchMatching(
          creatdAt.format("DD MMM YYYY"),
        );
        const isoCreatdAt = prepareSearchMatching(creatdAt.toISOString());
        const dateCreatedAt = prepareSearchMatching(creatdAt.toString());

        return (
          section.includes(value) ||
          title.includes(value) ||
          type.includes(value) ||
          formatedCreatedAt.includes(value) ||
          isoCreatdAt.includes(value) ||
          dateCreatedAt.includes(value)
        );
      }),
    [tasks, searchValue],
  );

  const groupedTasksBySection = useMemo(() => {
    const firstTask = filteredTasks[0];

    if (!firstTask) return {};

    const newTasks = filteredTasks.slice(1).reduce(
      (acc, task) => {
        const lastTasks = acc.at(-1)!;
        const lastTask = lastTasks.at(-1)!;

        if (task.section === lastTask.section) {
          lastTasks.push(task);
          acc[acc.length - 1] = lastTasks.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
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
  }, [filteredTasks]);

  if (tasks.length === 0 && !isLoading)
    return (
      <CourseEmptyTab
        icon={<BiNotepad className="text-7xl text-muted-foreground" />}
        text={
          isAuthor ? (
            <p>
              Похоже, что на вашем курсе все еще нет заданий.{" "}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-block text-primary">
                  Давайте создадим новое вместе.
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={
                          router.query.courseId &&
                          typeof router.query.courseId === "string"
                            ? PagePathMap.CreateLec +
                              "?courseId=" +
                              router.query.courseId
                            : PagePathMap.CreateLec
                        }
                      >
                        <TbBook2 className="mr-2 text-xl" />
                        <span>Лекционный материал</span>
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={
                          router.query.courseId &&
                          typeof router.query.courseId === "string"
                            ? PagePathMap.CreateQuiz +
                              "?courseId=" +
                              router.query.courseId
                            : PagePathMap.CreateQuiz
                        }
                      >
                        <TbListDetails className="mr-2 text-xl" />
                        <span>Тестирование</span>
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={
                          router.query.courseId &&
                          typeof router.query.courseId === "string"
                            ? PagePathMap.CreatePract +
                              "?courseId=" +
                              router.query.courseId
                            : PagePathMap.CreatePract
                        }
                      >
                        <TbBallpen className="mr-2 text-xl" />
                        <span>Практическая работа</span>
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
              В случае если вы уже это сделали, но тут ничего не появилось,
              тогда проблема остается на нашей стороне. Попробуйте вернуться
              позже.
            </p>
          ) : (
            <p>
              Похоже, что на курсе еще нет заданий. Есть риск проблем с сервером
              на нашей стороне. Либо в скором времени преподаватель опубликует
              тут новый материал. В любом случае, оставайтесь на связи и
              попробуйте вернуться позже.
            </p>
          )
        }
      />
    );

  return (
    <div>
      <div
        className={cn(
          "mb-4 grid grid-cols-[1fr_repeat(2,minmax(0,auto))] items-center gap-2",
          {
            "min-[570px]:grid-cols-[1fr_repeat(3,minmax(0,auto))]": isAuthor,
          },
        )}
      >
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск заданий..."
          className="max-w-64"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={isLoading}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 bg-transparent max-[1100px]:h-10 max-[1100px]:w-10 max-[1100px]:border-none max-[1100px]:shadow-none"
              disabled={isLoading}
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
            className="w-auto justify-between gap-2 bg-transparent max-[1100px]:border-none max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
            disabled={isLoading}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" className="gap-2 max-[570px]:hidden">
              <BiPlus className="text-xl" />
              <span>Новое задание</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  href={
                    router.query.courseId &&
                    typeof router.query.courseId === "string"
                      ? PagePathMap.CreateLec +
                        "?courseId=" +
                        router.query.courseId
                      : PagePathMap.CreateLec
                  }
                >
                  <TbBook2 className="mr-2 text-xl" />
                  <span>Лекционный материал</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  href={
                    router.query.courseId &&
                    typeof router.query.courseId === "string"
                      ? PagePathMap.CreateQuiz +
                        "?courseId=" +
                        router.query.courseId
                      : PagePathMap.CreateQuiz
                  }
                >
                  <TbListDetails className="mr-2 text-xl" />
                  <span>Тестирование</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  href={
                    router.query.courseId &&
                    typeof router.query.courseId === "string"
                      ? PagePathMap.CreatePract +
                        "?courseId=" +
                        router.query.courseId
                      : PagePathMap.CreatePract
                  }
                >
                  <TbBallpen className="mr-2 text-xl" />
                  <span>Практическая работа</span>
                </Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </div>
      <div className="space-y-2">
        {!isLoading ? (
          filteredTasks.length > 0 ? (
            Object.entries(groupedTasksBySection).map(([section, tasks]) => (
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
            <CourseEmptyTab
              icon={<BiNotepad className="text-7xl text-muted-foreground" />}
              text={<p>Нет результатов.</p>}
            />
          )
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
