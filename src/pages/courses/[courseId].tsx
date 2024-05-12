import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  BiSolidConversation,
  BiSolidGroup,
  BiSolidNotepad,
  BiSolidWidget,
} from "react-icons/bi";
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
      text: "Введение",
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
            group: true;
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
    attachments: true;
    tasks: {
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
    };
    announcements: {
      include: {
        attachments: true;
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
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
        group: {
          id: "123",
          name: "К.105с11-5",
        },
      },
      userId: crypto.randomUUID(),
    },
  ],
  attachments: [
    {
      id: "1",
      name: "Ссылка №1",
      href: "#",
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "5",
      name: "Таблица №1.csv",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "9",
      name: "Таблица №2.xls",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "2",
      name: "Документ №1.pdf",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "3",
      name: "Документ №2.doc",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "4",
      name: "Документ №3.docx",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "6",
      name: "Архив №1.rar",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "11",
      name: "Изображение №3.jpg",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "7",
      name: "Изображение №1.png",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "10",
      name: "Изображение №2.svg",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "12",
      name: "Изображение №4.webp",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "13",
      name: "Изображение №5.xcf",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "14",
      name: "Изображение №6.gif",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "8",
      name: "Файл №1.bat",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "15",
      name: "Файл №2.ai",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "16",
      name: "Файл №3.xml",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "17",
      name: "Файл №4.html",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "18",
      name: "Файл №5.css",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "19",
      name: "Файл №6.js",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "20",
      name: "Файл №7.jsx",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "21",
      name: "Файл №8.ts",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "22",
      name: "Файл №9.tsx",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "24",
      name: "Файл №10.db",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "25",
      name: "Файл №11.sql",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "26",
      name: "Файл №12.php",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "27",
      name: "Файл №13.txt",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
    {
      id: "23",
      name: "Презентация №1.ppt",
      href: null,
      courseId: crypto.randomUUID(),
      key: "123",
      uploadedAt: new Date(),
    },
  ],
  tasks: [
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      attachments: [
        {
          href: null,
          id: "123",
          name: "Презентация №1.ppt",
          taskId: "123",
          key: "123",
          uploadedAt: new Date(),
        },
      ],
      attempts: [],
      availableAttempts: null,
      availableTime: null,
      createdAt: new Date(),
      restrictedGroups: [],
      restrictedUsers: [],
      deadline: null,
      isHidden: false,
      section:
        "Unit 1.1. The United Kingdom of Great Britain and Northern Ireland",
      title: "The surfce of the USA",
      type: "Lec",
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      attachments: [],
      attempts: [],
      availableAttempts: 3,
      availableTime: 1000 * 60 * 30,
      createdAt: new Date(),
      restrictedGroups: [],
      restrictedUsers: [],
      deadline: null,
      isHidden: false,
      section:
        "Unit 1.1. The United Kingdom of Great Britain and Northern Ireland",
      title: "The surfce of the USA",
      type: "Quiz",
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      attachments: [],
      attempts: [],
      availableAttempts: null,
      availableTime: null,
      createdAt: new Date(),
      restrictedGroups: [],
      restrictedUsers: [],
      deadline: new Date("04/25/2024 23:59:59"),
      isHidden: false,
      section:
        "Unit 1.1. The United Kingdom of Great Britain and Northern Ireland",
      title: "The surfce of the USA",
      type: "Pract",
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      attachments: [],
      attempts: [],
      availableAttempts: null,
      availableTime: null,
      createdAt: new Date(),
      restrictedGroups: [],
      restrictedUsers: [],
      deadline: null,
      isHidden: false,
      section:
        "Unit 1.2. The United Kingdom of Great Britain and Northern Ireland",
      title: "The surfce of the USA",
      type: "Quiz",
      updatedAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      courseId: crypto.randomUUID(),
      attachments: [],
      attempts: [],
      availableAttempts: 3,
      availableTime: 1000 * 60 * 30,
      createdAt: new Date(),
      restrictedGroups: [],
      restrictedUsers: [],
      deadline: null,
      isHidden: false,
      section:
        "Unit 1.2. The United Kingdom of Great Britain and Northern Ireland",
      title: "The surfce of the USA",
      type: "Quiz",
      updatedAt: new Date(),
    },
  ],
  announcements: [
    {
      id: crypto.randomUUID(),
      courseId: "course_1",
      title: "Карьерная гостинная",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit expedita voluptatibus temporibus quibusdam voluptates quae repellendus voluptate nobis hic, quam beatae esse fugiat vero, natus reiciendis minus odio eveniet alias.",
      createdAt: new Date(),
      attachments: [
        {
          id: crypto.randomUUID(),
          name: "Таблица №1.csv",
          href: null,
          announcementId: crypto.randomUUID(),
          key: "123",
          uploadedAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          name: "Документ №1.pdf",
          href: null,
          announcementId: crypto.randomUUID(),
          key: "123",
          uploadedAt: new Date(),
        },
        {
          id: crypto.randomUUID(),
          name: "Документ №2.doc",
          href: null,
          announcementId: crypto.randomUUID(),
          key: "123",
          uploadedAt: new Date(),
        },
      ],
    },
  ],
};

const CoursePage: NextPageWithLayout = () => {
  const { data: session } = useSession();
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

  const isAuthor = false;
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
            description={MOK_DATA.description}
            attachments={MOK_DATA.attachments}
          />
        </TabsContent>
        <TabsContent value={TabsMap.Tasks}>
          <CourseTasksTab
            tasks={MOK_DATA.tasks}
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
            announcements={MOK_DATA.announcements}
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
