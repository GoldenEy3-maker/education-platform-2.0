import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  BiBookmarkMinus,
  BiDotsVerticalRounded,
  BiMessageAlt,
  BiRightArrowAlt,
  BiSearch,
  BiSolidConversation,
  BiSolidGroup,
  BiSolidNotepad,
  BiSolidWidget,
  BiSortAlt2,
} from "react-icons/bi";

import { Avatar } from "~/components/avatar";
import { CourseHead } from "~/components/course-head";
import { CourseOverviewTab } from "~/components/course-overview-tab";
import { ProgressCircle } from "~/components/progress-circle";
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
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useRouterQueryState } from "~/hooks/routerQueryState";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "../_app";

const TabsMap = {
  Overview: "Overview",
  Tasks: "Tasks",
  Subscribers: "Subscribers",
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
    Subscribers: {
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
  description:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Totam, quisquam? Accusamus dicta eum nesciunt ut, cumque corporis nulla explicabo reiciendis quisquam, pariatur odio id unde sapiente repudiandae. Nihil, hic dicta. Aliquid illo dignissimos quod odio. Omnis repellendus saepe cupiditate aliquam ratione, nemo vel repellat sapiente illum fuga labore cum suscipit iusto, reiciendis voluptas totam beatae repudiandae, reprehenderit et quod porro! Expedita blanditiis ea dolor itaque, hic reiciendis optio mollitia obcaecati recusandae neque vero soluta. Odit consequuntur soluta, sed voluptatibus ipsa itaque enim quas qui blanditiis modi, accusantium quod temporibus ullam.",
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

const SortValueSubscribersMap = {
  Recent: "Recent",
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const TranslatedSortValueSubscribersMap: Record<
  SortValueSubscribersMap,
  string
> = {
  Recent: "Недавним",
  Alphabet: "Алфавиту",
  Progress: "Прогрессу",
} as const;

type SortValueSubscribersMap = ValueOf<typeof SortValueSubscribersMap>;

const CoursePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "Overview");
  const [sortValueSubscribers, setSortValueSubscribers] =
    useState<SortValueSubscribersMap>("Recent");

  const isAuthor = true;
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
      <CourseHead
        isAuthor={isAuthor}
        isSubStudent={isSubStudent}
        isTeacher={isTeacher}
        isLoading={isLoading}
        author={MOK_DATA.author}
        isArchived={MOK_DATA.isArchived}
        subscribers={MOK_DATA.subscribers}
        title={MOK_DATA.title}
      />
      <Tabs
        value={tabs}
        onValueChange={(value) => setTabs(value as TabsMap)}
        className="mt-4"
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
        <TabsContent value={TabsMap.Overview} className="space-y-4">
          <CourseOverviewTab description={MOK_DATA.description} />
        </TabsContent>
        <TabsContent value={TabsMap.Subscribers}>
          <div className="flex items-center justify-between gap-2">
            <Input
              leadingIcon={<BiSearch className="text-xl" />}
              placeholder="Поиск участников..."
              className="max-w-80"
            />
            <Select
              defaultValue={SortValueSubscribersMap.Recent}
              value={sortValueSubscribers}
              onValueChange={(value: SortValueSubscribersMap) =>
                setSortValueSubscribers(value)
              }
            >
              <Button
                asChild
                variant="outline"
                className="w-auto justify-between gap-2 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
              >
                <SelectTrigger>
                  <BiSortAlt2 className="shrink-0 text-xl min-[1100px]:hidden" />
                  <p className="max-[1100px]:hidden">
                    <span className="text-muted-foreground">
                      Сортировать по
                    </span>
                    &nbsp;
                    <SelectValue />
                  </p>
                </SelectTrigger>
              </Button>
              <SelectContent>
                {Object.entries(TranslatedSortValueSubscribersMap).map(
                  ([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
            <div className="relative rounded-md border bg-background p-4">
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <BiMessageAlt className="mr-2 text-xl" />
                    <span>Перейти в чат</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiBookmarkMinus className="mr-2 text-xl" />
                    <span>Отписать</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col items-center ">
                <Avatar fallback="КД" className="h-16 w-16" />
                <p className="font-medium">Королев Данил</p>
                <span className="text-sm text-muted-foreground">
                  danil-danil-korolev@bk.ru
                </span>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">3</p>
                  <span className="text-sm text-muted-foreground">
                    Завершено
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ProgressCircle
                    className="text-2xl text-primary"
                    strokeWidth={8}
                    value={30}
                  />
                  <span className="text-sm text-muted-foreground">
                    Прогресс (30%)
                  </span>
                </div>
              </div>
              <footer className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <Button variant="link" asChild className="gap-2">
                  <Link href="#">
                    <span>Профиль</span>
                    <BiRightArrowAlt className="text-xl" />
                  </Link>
                </Button>
              </footer>
            </div>
            <div className="relative rounded-md border bg-background p-4">
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <BiMessageAlt className="mr-2 text-xl" />
                    <span>Перейти в чат</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiBookmarkMinus className="mr-2 text-xl" />
                    <span>Отписать</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col items-center ">
                <Avatar fallback="КД" className="h-16 w-16" />
                <p className="font-medium">Королев Данил</p>
                <span className="text-sm text-muted-foreground">
                  danil-danil-korolev@bk.ru
                </span>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">3</p>
                  <span className="text-sm text-muted-foreground">
                    Завершено
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ProgressCircle
                    className="text-2xl text-primary"
                    strokeWidth={8}
                    value={30}
                  />
                  <span className="text-sm text-muted-foreground">
                    Прогресс (30%)
                  </span>
                </div>
              </div>
              <footer className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <Button variant="link" asChild className="gap-2">
                  <Link href="#">
                    <span>Профиль</span>
                    <BiRightArrowAlt className="text-xl" />
                  </Link>
                </Button>
              </footer>
            </div>
            <div className="relative rounded-md border bg-background p-4">
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <BiMessageAlt className="mr-2 text-xl" />
                    <span>Перейти в чат</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiBookmarkMinus className="mr-2 text-xl" />
                    <span>Отписать</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col items-center ">
                <Avatar fallback="КД" className="h-16 w-16" />
                <p className="font-medium">Королев Данил</p>
                <span className="text-sm text-muted-foreground">
                  danil-danil-korolev@bk.ru
                </span>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">3</p>
                  <span className="text-sm text-muted-foreground">
                    Завершено
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ProgressCircle
                    className="text-2xl text-primary"
                    strokeWidth={8}
                    value={30}
                  />
                  <span className="text-sm text-muted-foreground">
                    Прогресс (30%)
                  </span>
                </div>
              </div>
              <footer className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <Button variant="link" asChild className="gap-2">
                  <Link href="#">
                    <span>Профиль</span>
                    <BiRightArrowAlt className="text-xl" />
                  </Link>
                </Button>
              </footer>
            </div>
            <div className="relative rounded-md border bg-background p-4">
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
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <BiMessageAlt className="mr-2 text-xl" />
                    <span>Перейти в чат</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BiBookmarkMinus className="mr-2 text-xl" />
                    <span>Отписать</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col items-center ">
                <Avatar fallback="КД" className="h-16 w-16" />
                <p className="font-medium">Королев Данил</p>
                <span className="text-sm text-muted-foreground">
                  danil-danil-korolev@bk.ru
                </span>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">3</p>
                  <span className="text-sm text-muted-foreground">
                    Завершено
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <ProgressCircle
                    className="text-2xl text-primary"
                    strokeWidth={8}
                    value={30}
                  />
                  <span className="text-sm text-muted-foreground">
                    Прогресс (30%)
                  </span>
                </div>
              </div>
              <footer className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <Button variant="link" asChild className="gap-2">
                  <Link href="#">
                    <span>Профиль</span>
                    <BiRightArrowAlt className="text-xl" />
                  </Link>
                </Button>
              </footer>
            </div>
          </div>
        </TabsContent>
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
