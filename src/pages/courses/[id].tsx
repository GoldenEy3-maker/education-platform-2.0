import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  BiSolidConversation,
  BiSolidGroup,
  BiSolidNotepad,
  BiSolidWidget,
} from "react-icons/bi";
import { CourseAnnouncementsTab } from "~/components/course-announcements-tab";
import { CourseHead } from "~/components/course-head";
import { CourseOverviewTab } from "~/components/course-overview-tab";
import {
  CourseSubscribersTab,
  type SortValueSubscribersMap,
} from "~/components/course-subscribers-tab";
import {
  CourseTasksTab,
  type FiltersTasksMap,
  type SortValueTasksMap,
} from "~/components/course-tasks-tab";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
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
  Announcements: "Announcements",
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
    Announcements: {
      icon: (
        <BiSolidConversation className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Объявления",
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
            email: true;
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
        email: "danil-danil-korolev@bk.ru",
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
        email: "danil-danil-korolev@bk.ru",
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
        email: "danil-danil-korolev@bk.ru",
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
        email: "danil-danil-korolev@bk.ru",
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
        email: "danil-danil-korolev@bk.ru",
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
        email: "danil-danil-korolev@bk.ru",
      },
      userId: crypto.randomUUID(),
    },
  ],
};

const CoursePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "Overview");
  const [searchValueSubscribers, setSearchValueSubscribers] = useState("");
  const [sortValueSubscribers, setSortValueSubscribers] =
    useState<SortValueSubscribersMap>("Recent");
  const [searchValueTasks, setSearchValueTasks] = useState("");
  const [searchValueAnnouncements, setSearchValueAnnouncements] = useState("");
  const [sortValueTasks, setSortValueTasks] =
    useState<SortValueTasksMap>("Recent");
  const [filtersTasks, setFiltersTasks] = useState<
    Record<FiltersTasksMap, boolean>
  >({
    HideLabs: false,
    HideCompleted: false,
    HideLectures: false,
    HideTests: false,
  });

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
        <TabsContent value={TabsMap.Overview}>
          <CourseOverviewTab
            isLoading={isLoading}
            description={MOK_DATA.description}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Tasks}>
          <CourseTasksTab
            searchValue={searchValueTasks}
            onSearchValueChange={setSearchValueTasks}
            sortValue={sortValueTasks}
            onSortValueChange={setSortValueTasks}
            filters={filtersTasks}
            onFiltersChange={(key) =>
              setFiltersTasks((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            isAuthor={isAuthor}
            isSubStudent={isSubStudent}
            isTeacher={isTeacher}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Subscribers}>
          <CourseSubscribersTab
            sortValue={sortValueSubscribers}
            onSortValueChange={setSortValueSubscribers}
            searchValue={searchValueSubscribers}
            onSearchValueChange={setSearchValueSubscribers}
            subscribers={MOK_DATA.subscribers}
            isAuthor={isAuthor}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Announcements}>
          <CourseAnnouncementsTab
            searchValue={searchValueAnnouncements}
            onSearchValueChange={setSearchValueAnnouncements}
            isAuthor={isAuthor}
            isLoading={isLoading}
            isSubStudent={isSubStudent}
            isTeacher={isTeacher}
          />
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
