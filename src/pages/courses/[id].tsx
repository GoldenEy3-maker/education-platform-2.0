import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { type CSSProperties } from "react";
import {
  BiBookmarkMinus,
  BiBookmarkPlus,
  BiDotsVerticalRounded,
  BiPlus,
  BiShareAlt,
  BiSliderAlt,
  BiSolidConversation,
  BiSolidGroup,
  BiSolidNotepad,
  BiSolidWidget,
  BiStar,
  BiUserPlus,
} from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { usePersistedQueryState } from "~/hooks/persistedQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import {
  PagePathMap,
  type StatusCourseMap,
  TranslatedStatusCourseMap,
} from "~/libs/enums";
import { cn, getFirstLettersUserCredentials, type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "../_app";

const TabsMap = {
  Overview: "Overview",
  Tasks: "Tasks",
  Members: "Members",
  Discussions: "Discussion",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { icon: React.ReactNode; text: string }> =
  {
    Overview: {
      icon: (
        <BiSolidWidget className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Обзор",
    },
    Tasks: {
      icon: (
        <BiSolidNotepad className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Задания",
    },
    Members: {
      icon: (
        <BiSolidGroup className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Участники",
    },
    Discussion: {
      icon: (
        <BiSolidConversation className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Обсуждения",
    },
  };

const MOK_DATA: Prisma.CourseGetPayload<{
  include: {
    subscribers: {
      include: {
        user: {
          select: {
            id: true;
            fathername: true;
            name: true;
            surname: true;
            image: true;
          };
        };
      };
    };
    author: {
      select: {
        id: true;
        fathername: true;
        surname: true;
        name: true;
        status: true;
        image: true;
      };
    };
  };
}> = {
  id: crypto.randomUUID(),
  author: {
    id: "user_1",
    fathername: "Михайловна",
    image: null,
    name: "Любовь",
    status: "Преподаватель английского языка",
    surname: "Демкина",
  },
  authorId: "user_1",
  createdAt: new Date(),
  description: "",
  isArchived: false,
  title: "Иностранный язык в профессиональной деятельности",
  updatedAt: new Date(),
  subscribers: [
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      progress: 40,
      user: {
        id: crypto.randomUUID(),
        fathername: "Николаевич",
        name: "Данил",
        surname: "Королев",
        image: null,
      },
      userId: crypto.randomUUID(),
    },
  ],
};

const CoursePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [tabs, setTabs] = usePersistedQueryState<TabsMap>("tab", "Overview");

  const status: StatusCourseMap = MOK_DATA.isArchived
    ? "Archived"
    : "Published";

  const isAuthor = false;
  const isStudent = true;
  const isSubStudent = false;
  const isTeacher = false;
  const isLoading = false;

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={PagePathMap.Courses}>Курсы</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!isLoading ? (
              <BreadcrumbPage>{MOK_DATA.title}</BreadcrumbPage>
            ) : (
              <Skeleton className="h-5 w-52 rounded-full sm:w-72" />
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {!isLoading ? (
        <>
          <div
            className={cn(
              "mb-2 flex w-fit items-center gap-2 rounded-full bg-useful/10 px-3 py-1 text-sm text-useful",
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
          <h1 className="mb-2 text-3xl font-medium [text-wrap:balance]">
            {MOK_DATA.title}
          </h1>
          {(() => {
            if (isAuthor)
              return (
                <span className="text-muted-foreground">
                  Вы являетесь создателем этого курса.
                </span>
              );

            if (isTeacher && !isAuthor)
              return (
                <span className="text-muted-foreground">
                  Вы являетесь преподавателем, поэтому не сможете подписаться на
                  этот курс.
                </span>
              );

            if (isStudent && !isSubStudent)
              return (
                <span className="text-muted-foreground">
                  Вы не подписаны на этот курс.
                </span>
              );

            return (
              <div className="flex max-w-96 items-center gap-4">
                <Progress value={40} />
                <span className="whitespace-nowrap text-muted-foreground">
                  40% завершено
                </span>
              </div>
            );
          })()}
          <div
            className={cn(
              "mt-4 grid items-center gap-2 max-lg:grid-cols-[1fr_repeat(3,minmax(0,auto))] max-[570px]:grid-cols-[1fr_auto] lg:grid-cols-[1fr_repeat(4,minmax(0,auto))]",
              {
                "max-lg:grid-cols-[1fr_repeat(4,minmax(0,auto))]": isAuthor,
                "grid-cols-[1fr_auto] min-[570px]:grid-cols-[1fr_repeat(3,minmax(0,auto))]":
                  MOK_DATA.subscribers.length < 3 && !isAuthor,
              },
            )}
          >
            <div>
              <Button
                asChild
                variant="ghost"
                className="grid h-auto max-w-fit grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
              >
                <Link href="#">
                  <Avatar fallback="ДЛ" className="row-span-2 h-10 w-10" />
                  <p className="truncate font-medium">
                    {MOK_DATA.author.surname} {MOK_DATA.author.name}{" "}
                    {MOK_DATA.author.fathername}
                  </p>
                  <span className="truncate text-sm text-muted-foreground">
                    {MOK_DATA.author.status}
                  </span>
                </Link>
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full max-[570px]:hidden"
              size="icon"
            >
              <BiStar className="text-xl text-warning" />
              <span className="sr-only">Добавь в избранное</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full max-[570px]:hidden"
              size="icon"
            >
              <BiShareAlt className="text-xl" />
              <span className="sr-only">Поделиться</span>
            </Button>
            <div
              style={
                {
                  "--subscribers-length": MOK_DATA.subscribers.length,
                } as CSSProperties
              }
              className={cn(
                "grid grid-cols-[repeat(var(--subscribers-length),minmax(0,2.4rem))] items-center pr-2 max-lg:hidden",
                {
                  "grid-cols-1 pr-0 max-lg:block max-[570px]:hidden lg:grid-cols-[repeat(var(--subscribers-length),minmax(0,2.4rem))_auto]":
                    isAuthor,
                  "grid-cols-[repeat(5,minmax(0,2.4rem))]":
                    MOK_DATA.subscribers.length > 4,
                  "grid-cols-1 lg:grid-cols-[repeat(5,minmax(0,2.4rem))_auto]":
                    MOK_DATA.subscribers.length > 4 && isAuthor,
                  hidden: MOK_DATA.subscribers.length < 3 && !isAuthor,
                  "grid-cols-1": MOK_DATA.subscribers.length < 3 && isAuthor,
                },
              )}
            >
              {MOK_DATA.subscribers.length > 2 &&
                MOK_DATA.subscribers
                  .slice(0, 4)
                  .map((sub) => (
                    <Avatar
                      key={sub.user.id}
                      fallback={getFirstLettersUserCredentials(
                        sub.user.surname,
                        sub.user.name,
                      )}
                      src={sub.user.image}
                      className="rounded-full border-[4px] border-[hsla(213,39%,95%)] dark:border-[hsl(220,67%,13%)] max-lg:hidden"
                    />
                  ))}
              {MOK_DATA.subscribers.length > 4 ? (
                <div className="z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-[hsla(213,39%,95%)] dark:bg-[hsl(220,67%,13%)] lg:flex">
                  +{MOK_DATA.subscribers.length - 4}
                </div>
              ) : null}
              {isAuthor ? (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full border-dashed border-primary bg-primary/5 text-primary hover:border-transparent hover:bg-primary hover:text-primary-foreground hover:[--ripple-clr:theme('colors.primary.foreground')] lg:ml-3",
                    {
                      "ml-0": MOK_DATA.subscribers.length < 3,
                    },
                  )}
                >
                  <BiPlus className="text-xl" />
                  <span className="sr-only">Пригласить</span>
                </Button>
              ) : null}
            </div>

            {(() => {
              if (isAuthor)
                return (
                  <Button
                    asChild
                    variant="default"
                    className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
                  >
                    <Link href="#">
                      <BiSliderAlt className="shrink-0 text-xl" />
                      <span className="max-lg:hidden">Редактировать</span>
                      <span className="sr-only">Редактировать</span>
                    </Link>
                  </Button>
                );

              if (isSubStudent)
                return (
                  <Button
                    variant="destructive"
                    className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
                  >
                    <BiBookmarkMinus className="shrink-0 text-xl" />
                    <span className="max-lg:hidden">Отписаться</span>
                    <span className="sr-only">Отписаться</span>
                  </Button>
                );

              return (
                <Button
                  variant="default"
                  className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
                  disabled={isTeacher && !isAuthor}
                >
                  <BiBookmarkPlus className="shrink-0 text-xl" />
                  <span className="max-lg:hidden">Подписаться</span>
                  <span className="sr-only">Подписаться</span>
                </Button>
              );
            })()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full data-[state=open]:bg-accent min-[570px]:hidden"
                >
                  <BiDotsVerticalRounded className="text-xl" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60">
                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BiStar className="mr-2 text-xl text-warning" />
                    <span>Добавить в избранное</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiShareAlt className="mr-2 text-xl" />
                    <span>Поделиться</span>
                  </DropdownMenuItem>
                  {isAuthor ? (
                    <DropdownMenuItem>
                      <BiUserPlus className="mr-2 text-xl" />
                      <span>Пригласить</span>
                    </DropdownMenuItem>
                  ) : null}
                  {(() => {
                    if (isAuthor)
                      return (
                        <DropdownMenuItem>
                          <BiSliderAlt className="mr-2 text-xl" />
                          <span>Редактировать</span>
                        </DropdownMenuItem>
                      );

                    if (isSubStudent)
                      return (
                        <DropdownMenuItem>
                          <BiBookmarkMinus className="mr-2 text-xl" />
                          <span>Отписаться</span>
                        </DropdownMenuItem>
                      );

                    return (
                      <DropdownMenuItem disabled={!isAuthor && isTeacher}>
                        <BiBookmarkPlus className="mr-2 text-xl" />
                        <span>Подписаться</span>
                      </DropdownMenuItem>
                    );
                  })()}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <>
          <Skeleton className="mb-2 h-7 w-32 rounded-full" />
          <Skeleton className="mb-2 h-9 w-full rounded-full" />
          <Skeleton className="h-6 w-60 rounded-full sm:w-80" />
          <div className="flex items-center justify-between gap-2">
            <div className="mt-4 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 px-4 py-2">
              <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-44 rounded-full sm:w-60" />
              <Skeleton className="h-3 w-36 rounded-full sm:w-48" />
            </div>
            <Skeleton className="h-4 w-40 rounded-full max-lg:hidden" />
          </div>
        </>
      )}

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
      </Tabs>
    </main>
  );
};

CoursePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default CoursePage;
