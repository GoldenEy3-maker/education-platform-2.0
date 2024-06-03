import { useSession } from "next-auth/react";
import { useState } from "react";
import { BiConversation, BiGroup, BiHive, BiNotepad } from "react-icons/bi";
import { CourseAnnouncementsTab } from "~/components/course/announcements-tab";
import { CourseHead } from "~/components/course/head";
import { CourseOverviewTab } from "~/components/course/overview-tab";
import {
  CourseSubscribersTab,
  type SortValueSubscribersMap,
} from "~/components/course/subscribers-tab";
import {
  CourseTasksTab,
  type FiltersTasksMap,
  type SortValueTasksMap,
} from "~/components/course/tasks-tab";
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
import { api } from "~/libs/api";
import { useRouter } from "next/router";
import Link from "next/link";

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
        <BiHive className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Введение",
    },
    Tasks: {
      icon: (
        <BiNotepad className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Задания",
    },
    Subscribers: {
      icon: (
        <BiGroup className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Участники",
    },
    Announcements: {
      icon: (
        <BiConversation className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Объявления",
    },
  };

const CoursePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [tabs, setTabs] = useRouterQueryState<TabsMap>("tab", "Tasks");
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
    HidePract: false,
    HideCompleted: false,
    HideLec: false,
    HideTest: false,
  });

  const courseGetByIdQuery = api.course.getById.useQuery({
    id: router.query.courseId as string,
  });

  const isLoading = !session?.user || courseGetByIdQuery.isLoading;

  const isAuthor =
    courseGetByIdQuery.data && session?.user
      ? courseGetByIdQuery.data.authorId === session.user.id
      : false;
  const isSubStudent =
    courseGetByIdQuery.data?.subscribers.some(
      (sub) => sub.userId === session?.user.id,
    ) ?? false;
  const isTeacher = session?.user.role === "Teacher";

  return (
    <main>
      <Breadcrumb className="mb-4 overflow-hidden">
        <BreadcrumbList className="overflow-hidden">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={PagePathMap.Courses}>Курсы</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!isLoading ? (
              <BreadcrumbPage>
                {courseGetByIdQuery.data?.fullTitle}
              </BreadcrumbPage>
            ) : (
              <Skeleton className="h-5 w-52 rounded-full sm:w-72" />
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CourseHead
        id={courseGetByIdQuery.data?.id ?? ""}
        isAuthor={isAuthor}
        isSubStudent={isSubStudent}
        isTeacher={isTeacher}
        isLoading={isLoading}
        author={courseGetByIdQuery.data?.author}
        isArchived={courseGetByIdQuery.data?.isArchived ?? false}
        subscribers={courseGetByIdQuery.data?.subscribers ?? []}
        title={courseGetByIdQuery.data?.fullTitle ?? ""}
        isFavorite={
          courseGetByIdQuery.data?.favoritedBy.some(
            (fav) => fav.userId === session?.user.id,
          ) ?? false
        }
        progress={
          courseGetByIdQuery.data?.subscribers.find(
            (sub) => sub.userId === session?.user.id,
          )?.progress
        }
      />
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
        <TabsContent value={TabsMap.Overview}>
          <CourseOverviewTab
            isLoading={isLoading}
            description={courseGetByIdQuery.data?.description}
            attachments={courseGetByIdQuery.data?.attachments ?? []}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Tasks}>
          <CourseTasksTab
            tasks={courseGetByIdQuery.data?.tasks ?? []}
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
            subscribers={courseGetByIdQuery.data?.subscribers ?? []}
            isAuthor={isAuthor}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Announcements}>
          <CourseAnnouncementsTab
            announcements={courseGetByIdQuery.data?.announcements ?? []}
            searchValue={searchValueAnnouncements}
            onSearchValueChange={setSearchValueAnnouncements}
            isAuthor={isAuthor}
            isLoading={isLoading}
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
