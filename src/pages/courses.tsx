import { type Role } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import {
  BiFilterAlt,
  BiPlus,
  BiRightArrowAlt,
  BiSolidBookmark,
  BiSolidDetail,
  BiSolidMeteor,
  BiSolidStar,
  BiStar,
} from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Progress } from "~/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { cn, getPersonInitials, type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";

const TabsMap = {
  All: "All",
  Owned: "Owned",
  Favorited: "Favorited",
  Suggestions: "Suggestions",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { text: string; icon: React.ReactNode }> =
  {
    All: {
      text: "Все",
      icon: (
        <BiSolidDetail className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Owned: {
      text: "Мои",
      icon: (
        <BiSolidBookmark className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Favorited: {
      text: "Избранные",
      icon: (
        <BiSolidStar className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Suggestions: {
      text: "Рекомендации",
      icon: (
        <BiSolidMeteor className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
  };

const SortValueMap = {
  Recent: "Recent",
  New: "New",
  Progress: "Progress",
} as const;

const TranslateSortValueMap: Record<SortValueMap, string> = {
  Recent: "Недавним",
  New: "Новым",
  Progress: "Прогрессу",
} as const;

type SortValueMap = ValueOf<typeof SortValueMap>;

const StatusCourseMap = {
  Published: "Published",
  Archived: "Archived",
} as const;

type StatusCourseMap = ValueOf<typeof StatusCourseMap>;

const FiltersMap = {
  HideCompleted: "HideCompleted",
  HideArchived: "HideArchived",
  HidePublished: "HidePublished",
  HideNew: "HideNew",
} as const;

type FiltersMap = ValueOf<typeof FiltersMap>;

const FiltersContentMap: Record<FiltersMap, string> = {
  HideCompleted: "Скрыть завершенные",
  HideNew: "Скрыть новые",
  HideArchived: "Скрыть архивированные",
  HidePublished: "Скрыть публикации",
};

const TranslateStatusCourseMap: Record<StatusCourseMap, string> = {
  Archived: "Архивирован",
  Published: "Опубликован",
};

type CourseItemProps = {
  title: string;
  image?: string;
  description: string;
  status: StatusCourseMap;
  progress?: number;
  isFavorited: boolean;
} & React.ComponentProps<"div">;

const CourseItem: React.FC<CourseItemProps> = ({
  title,
  image,
  description,
  status,
  progress,
  isFavorited,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Link href="#">
        <Skeleton className="mb-3 h-48 w-full rounded-lg" />
      </Link>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div
          className={cn(
            "flex w-fit items-center gap-2 rounded-full bg-useful/10 px-3 py-1 text-sm text-useful",
            {
              "bg-destructive/10 text-destructive": status === "Archived",
            },
          )}
        >
          <div className="flex items-center justify-center">
            <span className="relative flex h-2 w-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full bg-useful opacity-75",
                  {
                    "bg-destructive": status === "Archived",
                  },
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full bg-useful",
                  {
                    "bg-destructive": status === "Archived",
                  },
                )}
              ></span>
            </span>
          </div>
          <span>{TranslateStatusCourseMap[status]}</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 rounded-full text-muted-foreground hover:text-warning",
            {
              "text-warning": isFavorited,
            },
          )}
        >
          {isFavorited ? (
            <BiSolidStar className="text-xl" />
          ) : (
            <BiStar className="text-xl" />
          )}
        </Button>
      </div>
      <p className="mb-1 line-clamp-2 text-lg font-medium">{title}</p>
      <p
        className={cn("mb-auto line-clamp-2 text-muted-foreground", {
          "line-clamp-4": !progress,
        })}
      >
        {description}
      </p>
      {progress ? (
        <div className="mt-2">
          <header className="mb-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="text-primary">{progress}%</span>
          </header>
          <Progress value={progress} />
        </div>
      ) : null}
      <footer className="mt-3 flex items-center justify-between gap-2 overflow-hidden">
        <Button
          className="h-auto w-fit justify-normal gap-3 px-2 py-1"
          variant="ghost"
          asChild
        >
          <Link href="#">
            <Avatar fallback="ДЛ" className="h-10 w-10" />
            <p className="truncate">
              {getPersonInitials("Демкина", "Любовь", "Михайловна")}
            </p>
          </Link>
        </Button>
        <Button variant="default" asChild className="gap-2">
          <Link href="#">
            <span>Перейти</span>
            <BiRightArrowAlt className="text-lg" />
          </Link>
        </Button>
      </footer>
    </div>
  );
};

const CoursesPage: NextPageWithLayout = () => {
  const role: Role = "Teacher";
  const [filters, setFilters] = useState<Record<FiltersMap, boolean>>({
    HideArchived: false,
    HideCompleted: false,
    HideNew: false,
    HidePublished: false,
  });
  const [sortValue, setSortValue] = useState<SortValueMap>("Recent");

  return (
    <main>
      <h1 className="mb-1 text-3xl font-medium">Курсы</h1>
      <div
        className={cn(
          "grid grid-cols-[1fr_repeat(2,minmax(0,auto))] items-center gap-2",
          {
            "grid-cols-[1fr_repeat(3,minmax(0,auto))]": role === "Teacher",
          },
        )}
      >
        <span className="text-muted-foreground">
          Все курсы разрабатываются квалифицированными преподавателями АГУ.
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <BiFilterAlt className="text-xl" />
              <span>Фильтры</span>
              <span className="w-7 rounded-full border py-0.5 text-sm text-muted-foreground">
                {Object.values(filters).filter((val) => val === true).length}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Фильтры</h4>
              <p className="text-sm text-muted-foreground">
                Параметры отображения курсов.
              </p>
            </div>
            <Separator className="my-2" />
            <div className="space-y-1">
              {Object.entries(FiltersContentMap).map(([key, value]) => (
                <Button
                  key={key}
                  asChild
                  variant="ghost"
                  className="w-full cursor-pointer justify-between gap-3"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      [key]: !prev[key as FiltersMap],
                    }))
                  }
                >
                  <div>
                    <Label htmlFor={key} className="pointer-events-none">
                      {value}
                    </Label>
                    <Switch id={key} checked={filters[key as FiltersMap]} />
                  </div>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Select
          defaultValue={SortValueMap.Recent}
          value={sortValue}
          onValueChange={(value: SortValueMap) => setSortValue(value)}
        >
          <Button
            asChild
            variant="outline"
            className="w-auto min-w-[15.5rem] justify-between"
          >
            <SelectTrigger>
              <p>
                <span className="text-muted-foreground">Сортировать по</span>
                &nbsp;
                <SelectValue />
              </p>
            </SelectTrigger>
          </Button>
          <SelectContent>
            {Object.entries(TranslateSortValueMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className={cn("gap-2", { hidden: role !== "Teacher" })} asChild>
          <Link href="#">
            <BiPlus className="text-xl" />
            <span>Создать новый</span>
          </Link>
        </Button>
      </div>
      <Tabs defaultValue={TabsMap.All} className="mt-4 overflow-hidden">
        <TabsList className="hidden-scrollbar mb-4 flex h-auto justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
          {Object.entries(TabsTriggerMap).map(([key, value]) => (
            <TabsTrigger
              value={key}
              asChild
              key={key}
              className="group h-auto shrink-0 gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
            >
              <Button variant="ghost" type="button">
                {value.icon}
                <span>{value.text}</span>
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={TabsMap.All}
          className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 gap-y-6"
        >
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited={false}
            // progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur"
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited={false}
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Archived"
            isFavorited
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык"
            status="Archived"
            isFavorited
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Archived"
            isFavorited
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited={false}
            progress={40}
          />
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited={false}
            progress={40}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
};

CoursesPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CoursesPage;
