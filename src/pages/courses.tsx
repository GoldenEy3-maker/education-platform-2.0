import { type Role } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { BiPlus, BiSolidStar, BiStar } from "react-icons/bi";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { cn, type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";

const TabsMap = {
  Owned: "Owned",
  Favorited: "Favorited",
  Suggestions: "Suggestions",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, string> = {
  Owned: "Мои",
  Favorited: "Избранные",
  Suggestions: "Рекомендации",
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
      <p className="mb-auto line-clamp-2 text-muted-foreground">
        {description}
      </p>
      <div className="mt-2">
        <header className="mb-2 flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Прогресс</span>
          <span className="text-primary">{progress}%</span>
        </header>
        <Progress value={progress} />
      </div>
    </div>
  );
};

const CoursesPage: NextPageWithLayout = () => {
  const role: Role = "Teacher";
  const [isHideCompleted, setIsHideCompleted] = useState(false);
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
        <Button
          asChild
          variant="ghost"
          className="cursor-pointer justify-between gap-3"
          onClick={() => setIsHideCompleted((prev) => !prev)}
        >
          <div>
            <Switch id="hide-completed" checked={isHideCompleted} />
            <Label htmlFor="hide-completed" className="pointer-events-none">
              Скрыть завершенные
            </Label>
          </div>
        </Button>
        <Select
          defaultValue={SortValueMap.Recent}
          value={sortValue}
          onValueChange={(value: SortValueMap) => setSortValue(value)}
        >
          <SelectTrigger className="w-auto min-w-60">
            <p>
              <span className="text-muted-foreground">Сортировать по</span>
              &nbsp;
              <SelectValue />
            </p>
          </SelectTrigger>
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
      <Tabs defaultValue={TabsMap.Owned} className="mt-4 overflow-hidden">
        <TabsList className="hidden-scrollbar mb-4 flex h-auto justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
          {Object.entries(TabsTriggerMap).map(([key, value]) => (
            <TabsTrigger
              value={key}
              asChild
              key={key}
              className="group h-auto shrink-0 gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
            >
              <Button variant="ghost" type="button">
                {value}
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value={TabsMap.Owned}
          className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4 gap-y-6"
        >
          <CourseItem
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae."
            title="Иностранный язык в профессиональной деятельности"
            status="Published"
            isFavorited={false}
            progress={40}
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
