import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  BiBook,
  BiDetail,
  BiFilterAlt,
  BiMeteor,
  BiPlus,
  BiSearch,
  BiSolidBookmark,
  BiSolidDetail,
  BiSolidMeteor,
  BiSolidStar,
  BiSortAlt2,
  BiStar,
} from "react-icons/bi";
import { CourseItem, CourseItemSkeleton } from "~/components/course-item";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useRouterQueryState } from "~/hooks/routerQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap, StatusCourseContentMap } from "~/libs/enums";
import { cn, prepareSearchMatching, type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "../_app";
import { api, type RouterOutputs } from "~/libs/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";

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
        <BiDetail className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Owned: {
      text: "Мои",
      icon: (
        <BiBook className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Favorited: {
      text: "Избранные",
      icon: (
        <BiStar className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
    Suggestions: {
      text: "Рекомендации",
      icon: (
        <BiMeteor className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
    },
  };

const SortValueMap = {
  Recent: "Recent",
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const SortValueContentMap: Record<SortValueMap, string> = {
  Recent: "Недавним",
  Alphabet: "Алфавиту",
  Progress: "Прогрессу",
} as const;

type SortValueMap = ValueOf<typeof SortValueMap>;

const FiltersMap = {
  HideCompleted: "HideCompleted",
  HideArchived: "HideArchived",
  HidePublished: "HidePublished",
} as const;

type FiltersMap = ValueOf<typeof FiltersMap>;

const FiltersContentMap: Record<FiltersMap, string> = {
  HideCompleted: "Скрыть завершенные",
  HideArchived: "Скрыть архивированные",
  HidePublished: "Скрыть публикации",
};

type CoursesEmptyProps = {
  icon: React.ReactNode;
  text: React.ReactNode;
};

const CoursesEmpty: React.FC<CoursesEmptyProps> = ({ icon, text }) => {
  return (
    <div className="col-span-4 mx-auto flex max-w-[40rem] flex-col items-center justify-center p-6">
      {icon}
      <div className="mt-2 text-center">{text}</div>
    </div>
  );
};

const CoursesPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchValue, setSearchValue] = useRouterQueryState<string>(
    "search",
    "",
  );
  const [filters, setFilters] = useState<Record<FiltersMap, boolean>>({
    HideArchived: false,
    HideCompleted: false,
    HidePublished: false,
  });
  const [sortValue, setSortValue] = useState<SortValueMap>("Recent");
  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "All");

  const activeFilters = Object.values(filters).filter((val) => val === true);

  const getAllCoursesQuery = api.course.getAll.useQuery();

  const isLoading = !session?.user || getAllCoursesQuery.isLoading;

  const subscriptionsData =
    getAllCoursesQuery.data?.filter((course) =>
      course.subscribers.some((sub) => sub.userId === session?.user.id),
    ) ?? [];
  const favoritesData =
    getAllCoursesQuery.data?.filter((course) =>
      course.favoritedBy.some((fav) => fav.userId === session?.user.id),
    ) ?? [];
  const suggestionsData =
    getAllCoursesQuery.data?.filter(
      (course) =>
        !subscriptionsData.some((subCourse) => subCourse.id === course.id),
    ) ?? [];

  const coursesDataMap: Record<TabsMap, RouterOutputs["course"]["getAll"]> = {
    All: getAllCoursesQuery.data ?? [],
    Owned: subscriptionsData,
    Favorited: favoritesData,
    Suggestions: suggestionsData,
  };

  const EmptyDataMap: Record<TabsMap, React.ReactNode> = {
    All: (
      <CoursesEmpty
        icon={<BiSolidDetail className="text-7xl text-muted-foreground" />}
        text={
          <p>
            Похоже, что на данный момент на портале нет курсов... Есть риск
            проблем с сервером на нашей стороне. Либо же преподаватели в скором
            времени подготовят для вас новый и интересный материал. В любом
            случае, оставайтесь на связи и попробуйте вернуться позже. Мы вас
            всегда ждем!
          </p>
        }
      />
    ),
    Owned: (
      <CoursesEmpty
        icon={<BiSolidBookmark className="text-7xl text-muted-foreground" />}
        text={
          session?.user.role === "Student" ? (
            <p>
              Похоже, что вы все еще не подписаны ни на один курс.{" "}
              <span
                className="cursor-pointer text-primary"
                onClick={() => setTabs("Suggestions")}
              >
                Скорее посетите вкладку &quot;Рекомендации&quot;,
              </span>{" "}
              или же воспользуетесь инструментами поиска на старнице, чтобы
              найти необходимый курс. В случае если вы подписывались на курс, но
              тут его нет, тогда проблема остается на нашей стороне. Попробуйте
              вернуться позже. Мы вас всегда ждем!
            </p>
          ) : session?.user.role === "Teacher" ? (
            <p>
              Похоже, что вы все еще не опубликовали ни одного курса.{" "}
              <Link href="#" className="text-primary">
                Скорее перейдите к созданию нового.
              </Link>{" "}
              В случае если у вас уже есть опубликованные курсы, но тут они не
              появляются, тогда проблема остается на нашей стороне. Попробуйте
              вернуться позже. Мы вас всегда ждем!
            </p>
          ) : null
        }
      />
    ),
    Favorited: (
      <CoursesEmpty
        icon={<BiSolidStar className="text-7xl text-muted-foreground" />}
        text={
          <p>
            Похоже, что вы все еще ничего не добавляли в избранное. Это функция
            поможет вам быстрее ориентироваться на портале при поиске
            необходимых материалов. В случае если вы все же добавляли уже в
            избранное какие-то материалы, но тут ничего нет, тогда проблема
            остается на нашей стороне. Попробуйте вернуться позже. Мы вас всегда
            ждем!
          </p>
        }
      />
    ),
    Suggestions: (
      <CoursesEmpty
        icon={<BiSolidMeteor className="text-7xl text-muted-foreground" />}
        text={
          <p>
            Похоже, что на данный момент нам нечего вам предложить... Есть риск
            проблем с сервером на нашей стороне. Либо же преподаватели в скором
            времени подготовят для вас новый и интересный материал. В любом
            случае, оставайтесь на связи и попробуйте вернуться позже. Мы вас
            всегда ждем!
          </p>
        }
      />
    ),
  };

  return (
    <main>
      <div className="mb-1 grid grid-cols-1 grid-rows-[auto_auto] gap-x-3 sm:grid-cols-[auto_1fr]">
        <span className="row-span-2 hidden h-14 w-14 items-center justify-center rounded-full border border-input sm:flex">
          <BiBook className="text-2xl" />
        </span>
        <h1 className="text-2xl font-medium">Курсы</h1>
        <span className="text-muted-foreground">
          Все курсы разрабатываются квалифицированными преподавателями АГУ.
        </span>
      </div>

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
              className="gap-2 bg-transparent max-[1100px]:h-10 max-[1100px]:w-10 max-[1100px]:border-none max-[1100px]:shadow-none"
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
            className="w-auto justify-between gap-2 bg-transparent max-[1100px]:border-none max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
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
            {Object.entries(SortValueContentMap).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {session?.user.role === "Teacher" ? (
          <Button
            className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full"
            asChild
          >
            <Link href={PagePathMap.CreateCourse}>
              <BiPlus className="shrink-0 text-xl" />
              <span className="max-lg:hidden">Создать новый</span>
            </Link>
          </Button>
        ) : null}
      </div>
      <Tabs
        value={tabs}
        onValueChange={(value) => setTabs(value as TabsMap)}
        className="mt-4"
      >
        <TabsList className="hidden-scrollbar mb-4 flex h-auto max-w-full justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
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
        {Object.entries(coursesDataMap).map(([key, data]) => {
          const filteredData = data.filter((course) => {
            const value = prepareSearchMatching(searchValue);
            const creatdAt = dayjs(course.createdAt);
            const fullTitle = prepareSearchMatching(course.fullTitle).includes(
              value,
            );
            const shortTitle = course.shortTitle
              ? prepareSearchMatching(course.shortTitle).includes(value)
              : true;
            const status = prepareSearchMatching(
              StatusCourseContentMap[
                course.isArchived ? "Archived" : "Published"
              ],
            ).includes(value);
            const formatedCreatedAt = prepareSearchMatching(
              creatdAt.format("DD MMM YYYY"),
            ).includes(value);
            const isoCreatdAt = prepareSearchMatching(
              creatdAt.toISOString(),
            ).includes(value);
            const dateCreatedAt = prepareSearchMatching(
              creatdAt.toString(),
            ).includes(value);

            return (
              fullTitle ||
              shortTitle ||
              status ||
              formatedCreatedAt ||
              isoCreatdAt ||
              dateCreatedAt
            );
          });

          return (
            <TabsContent
              key={key}
              value={key}
              className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4 gap-y-6"
            >
              {!isLoading ? (
                filteredData.length > 0 ? (
                  filteredData.map((course) => (
                    <CourseItem
                      key={course.id}
                      id={course.id}
                      image={course.image}
                      title={course.fullTitle}
                      status={course.isArchived ? "Archived" : "Published"}
                      isFavorited={favoritesData.some(
                        (fav) => fav.id === course.id,
                      )}
                      author={course.author}
                      progress={40}
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
          );
        })}
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
