import { type Prisma, type Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  BiFilterAlt,
  BiPlus,
  BiRightArrowAlt,
  BiSearch,
  BiSolidBookmark,
  BiSolidDetail,
  BiSolidMeteor,
  BiSolidStar,
  BiSortAlt2,
  BiStar,
} from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
import { usePersistedQueryState } from "~/hooks/persistedQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import {
  PagePathMap,
  type StatusCourseMap,
  TranslatedStatusCourseMap,
} from "~/libs/enums";
import {
  cn,
  getFirstLettersUserCredentials,
  getPersonInitials,
  type ValueOf,
} from "~/libs/utils";
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
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const TranslatedSortValueMap: Record<SortValueMap, string> = {
  Recent: "Недавним",
  Alphabet: "Алфавиту",
  Progress: "Прогрессу",
} as const;

type SortValueMap = ValueOf<typeof SortValueMap>;

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

type CourseItemProps = {
  id: string;
  title: string;
  image?: string;
  description: string;
  status: StatusCourseMap;
  progress?: number;
  isFavorited: boolean;
  author: {
    surname: string;
    name: string;
    id: string;
    fathername: string | null;
    image: string | null;
  };
} & React.ComponentProps<"div">;

const CourseItem: React.FC<CourseItemProps> = ({
  id,
  title,
  image,
  description,
  status,
  progress,
  isFavorited,
  author,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Link href={PagePathMap.Course + id}>
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
          <span>{TranslatedStatusCourseMap[status]}</span>
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
            <Avatar
              fallback={getFirstLettersUserCredentials(
                author.surname,
                author.name,
              )}
              src={author.image}
              className="h-10 w-10"
            />
            <p className="truncate">
              {getPersonInitials(
                author.surname,
                author.name,
                author.fathername,
              )}
            </p>
          </Link>
        </Button>
        <Button variant="link" asChild className="gap-2">
          <Link href={PagePathMap.Course + id}>
            <span>Перейти</span>
            <BiRightArrowAlt className="text-lg" />
          </Link>
        </Button>
      </footer>
    </div>
  );
};

const CourseItemSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-48 w-full rounded-lg" />
      <Skeleton className="mb-4 h-6 w-32 rounded-full" />
      <Skeleton className="mb-3 h-6 w-full rounded-full" />
      <Skeleton className="mb-1 h-4 w-full rounded-full" />
      <Skeleton className="mb-1 h-4 w-full rounded-full" />
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-full rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
    </div>
  );
};

type CoursesEmptyProps =
  | {
      icon: React.ReactNode;
      text: React.ReactNode;
      textBasedOnRole: false;
    }
  | {
      icon: React.ReactNode;
      text: Record<Exclude<Role, "Admin">, React.ReactNode>;
      textBasedOnRole: true;
    };

const CoursesEmpty: React.FC<CoursesEmptyProps> = ({
  icon,
  text,
  textBasedOnRole,
}) => {
  const { data: session } = useSession();

  const excludeUserRole = (role: Role | undefined) => {
    if (role === "Teacher") return "Teacher";

    return "Student";
  };

  const role = excludeUserRole(session?.user.role);

  return (
    <div className="col-span-4 mx-auto flex max-w-[40rem] flex-col items-center justify-center p-6">
      {icon}
      {textBasedOnRole ? text[role] : text}
    </div>
  );
};

const MOK_DATA: Prisma.CourseGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        image: true;
        name: true;
        surname: true;
        fathername: true;
      };
    };
  };
}>[] = [
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: false,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: true,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: false,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: false,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: true,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: false,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: false,
  },
  {
    id: crypto.randomUUID(),
    author: {
      image: null,
      surname: "Демкина",
      name: "Любовь",
      fathername: "Михайловна",
      id: "user_1",
    },
    authorId: "user_1",
    createdAt: new Date(),
    updatedAt: new Date(),
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste saepe quam aut ducimus voluptatem aliquid dolor distinctio explicabo. Illum officia voluptatibus, nemo obcaecati dolorum architecto aperiam numquam repudiandae quam! Repudiandae.",
    title: "Иностранный язык в профессиональной деятельности",
    isArchived: true,
  },
];

const CoursesPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const isLoading = !session?.user;
  const [searchValue, setSearchValue] = usePersistedQueryState<string>(
    "search",
    "",
  );
  const [filters, setFilters] = useState<Record<FiltersMap, boolean>>({
    HideArchived: false,
    HideCompleted: false,
    HideNew: false,
    HidePublished: false,
  });
  const [sortValue, setSortValue] = useState<SortValueMap>("Recent");
  const [tabs, setTabs] = usePersistedQueryState<TabsMap>("tab", "All");

  const activeFilters = Object.values(filters).filter((val) => val === true);

  const MOK_SUBSCRIPTIONS = MOK_DATA.slice(1, 4);
  const MOK_FAVORITES = MOK_DATA.slice(2, 6);
  const MOK_SUGGESTIONS = MOK_DATA.filter(
    (course) =>
      !MOK_SUBSCRIPTIONS.some((subCourse) => subCourse.id === course.id),
  );

  const MOK_DATA_MAP: Record<TabsMap, typeof MOK_DATA> = {
    All: MOK_DATA,
    Owned: MOK_SUBSCRIPTIONS,
    Favorited: MOK_FAVORITES,
    Suggestions: MOK_SUGGESTIONS,
  };

  const EmptyDataMap: Record<TabsMap, React.ReactNode> = {
    All: (
      <CoursesEmpty
        icon={<BiSolidDetail className="text-7xl text-muted-foreground" />}
        text={
          <p className="mt-2 text-center">
            Похоже, что на данный момент на портале нет курсов... Есть риск
            проблем с сервером на нашей стороне. Либо же преподаватели в скором
            времени подготовят для вас новый и интересный материал. В любом
            случае, оставайтесь на связи и попробуйте вернуться позже. Мы вас
            всегда ждем!
          </p>
        }
        textBasedOnRole={false}
      />
    ),
    Owned: (
      <CoursesEmpty
        icon={<BiSolidBookmark className="text-7xl text-muted-foreground" />}
        text={{
          Student: (
            <p className="mt-2 text-center">
              Похоже, что вы все еще не подписаны ни на один курс.{" "}
              <span
                className="cursor-pointer text-primary"
                onClick={() => setTabs("Suggestions")}
              >
                Скорее посетите вкладку &quot;Рекомендации&quot;,
              </span>{" "}
              или же воспользуетесь инструментами поиска на старнице, чтобы
              найти необходимый курс. В случае, если вы подписывались на курс,
              но тут его нет, тогда проблема остается на нашей стороне.
              Попробуйте вернуться позже. Мы вас всегда ждем!
            </p>
          ),
          Teacher: (
            <p className="mt-2 text-center">
              Похоже, что вы все еще не опубликовали ни одного курса.{" "}
              <Link href="#" className="text-primary">
                Скорее перейдите к созданию нового.
              </Link>{" "}
              В случае, если у вас уже есть опубликованные курсы, но тут они не
              появляются, тогда проблема остается на нашей стороне. Попробуйте
              вернуться позже. Мы вас всегда ждем!
            </p>
          ),
        }}
        textBasedOnRole
      />
    ),
    Favorited: (
      <CoursesEmpty
        icon={<BiSolidStar className="text-7xl text-muted-foreground" />}
        text={
          <p className="mt-2 text-center">
            Похоже, что вы все еще ничего не добавляли в избранное. Это функция
            поможет вам быстрее ориентироваться на портале при поиске
            необходимых материалов. В случае, если вы все же добавляли уже в
            избранное какие-то материалы, но тут ничего нет, тогда проблема
            остается на нашей стороне. Попробуйте вернуться позже. Мы вас всегда
            ждем!
          </p>
        }
        textBasedOnRole={false}
      />
    ),
    Suggestions: (
      <CoursesEmpty
        icon={<BiSolidMeteor className="text-7xl text-muted-foreground" />}
        text={
          <p className="mt-2 text-center">
            Похоже, что на данный момент нам нечего вам предложить... Есть риск
            проблем с сервером на нашей стороне. Либо же преподаватели в скором
            времени подготовят для вас новый и интересный материал. В любом
            случае, оставайтесь на связи и попробуйте вернуться позже. Мы вас
            всегда ждем!
          </p>
        }
        textBasedOnRole={false}
      />
    ),
  };

  return (
    <main>
      <h1 className="mb-1 text-3xl font-medium">Курсы</h1>
      <span className="text-muted-foreground">
        Все курсы разрабатываются квалифицированными преподавателями АГУ.
      </span>

      <div
        className={cn(
          "mt-4 grid grid-cols-[1fr_repeat(2,minmax(0,auto))] items-center gap-2",
          {
            "grid-cols-[1fr_repeat(3,minmax(0,auto))]":
              session?.user.role === "Teacher",
          },
        )}
      >
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск курсов..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="max-w-80 "
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 max-[1100px]:h-10 max-[1100px]:w-10 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:shadow-none"
            >
              <BiFilterAlt className="shrink-0 text-xl" />
              <span className="max-[1100px]:hidden">Фильтры</span>
              <span className="w-7 rounded-full border py-0.5 text-sm text-muted-foreground max-[1100px]:hidden">
                {activeFilters.length}
              </span>
              {activeFilters.length > 0 ? (
                <Badge className="absolute right-0 top-0 h-5 w-5 justify-center rounded-full text-xs min-[1100px]:hidden">
                  {activeFilters.length}
                </Badge>
              ) : null}
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
            className="w-auto justify-between gap-2 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
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
            {Object.entries(TranslatedSortValueMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className={cn("gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full", {
            hidden: session?.user.role !== "Teacher",
          })}
          asChild
        >
          <Link href="#">
            <BiPlus className="shrink-0 text-xl" />
            <span className="max-lg:hidden">Создать новый</span>
          </Link>
        </Button>
      </div>
      <Tabs
        value={tabs}
        onValueChange={(value) => setTabs(value as TabsMap)}
        className="mt-4 overflow-hidden"
      >
        <TabsList className="hidden-scrollbar mb-4 flex h-auto max-w-[calc(100vw-2rem)] justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
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
        {Object.entries(MOK_DATA_MAP).map(([key, data]) => (
          <TabsContent
            key={key}
            value={key}
            className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4 gap-y-6"
          >
            {!isLoading ? (
              data.length > 0 ? (
                data.map((course) => (
                  <CourseItem
                    key={course.id}
                    id={course.id}
                    description={course.description}
                    title={course.title}
                    status={course.isArchived ? "Archived" : "Published"}
                    isFavorited={MOK_FAVORITES.some(
                      (favCourse) => favCourse.id === course.id,
                    )}
                    author={course.author}
                    progress={
                      MOK_SUBSCRIPTIONS.some(
                        (subCourse) => subCourse.id === course.id,
                      )
                        ? 40
                        : undefined
                    }
                  />
                ))
              ) : (
                EmptyDataMap[key as TabsMap]
              )
            ) : (
              <>
                <CourseItemSkeleton />
                <CourseItemSkeleton />
                <CourseItemSkeleton />
                <CourseItemSkeleton />
              </>
            )}
          </TabsContent>
        ))}
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
