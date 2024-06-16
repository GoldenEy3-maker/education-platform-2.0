import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiBook, BiChevronRight, BiSolidFileFind } from "react-icons/bi";
import { PagePathMap } from "~/libs/enums";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CourseItem, CourseItemSkeleton } from "./course-item";
import { api } from "~/libs/api";
import { TbNotebook } from "react-icons/tb";

const CoursesEmpty: React.FC = () => {
  return (
    <div className="flex min-h-[inherit] flex-col items-center justify-center gap-2 p-4">
      <BiSolidFileFind className="text-7xl text-muted-foreground" />
      <p className="text-center [text-wrap:balance]">
        Тут вы сможете иметь быстрый доступ к вашим курсам.
      </p>
    </div>
  );
};

export const CoursesSection: React.FC = () => {
  const { data: session } = useSession();
  const isLoading = !session?.user;
  const isEmpty = false;

  const getAllCoursesQuery = api.course.getAll.useQuery();

  return (
    <section className="row-span-2 overflow-hidden rounded-lg border bg-background px-4 py-3 shadow">
      <header className="flex items-center gap-2 pb-3">
        <TbNotebook className="text-xl" />
        <h4 className="flex-grow text-lg font-semibold">Курсы</h4>
        <Button variant="outline" type="button" asChild className="gap-1">
          <Link href={PagePathMap.Courses}>
            <span>Смотреть все</span>
            <BiChevronRight className="text-xl" />
          </Link>
        </Button>
      </header>
      <Separator />
      <div className="custom-scrollbar mt-3 max-h-[30rem] space-y-1 overflow-auto min-[1120px]:max-h-[36.5rem] 2xl:max-h-[calc(100vh-11.5rem)]">
        {!getAllCoursesQuery.isLoading ? (
          getAllCoursesQuery.data?.length ? (
            getAllCoursesQuery.data.map((course) => (
              <CourseItem
                thumbnail={course.image}
                key={course.id}
                title={course.fullTitle}
                author={course.author}
                id={course.id}
                progress={20}
              />
            ))
          ) : (
            <CoursesEmpty />
          )
        ) : (
          <>
            <CourseItemSkeleton />
            <CourseItemSkeleton />
            <CourseItemSkeleton />
            <CourseItemSkeleton />
          </>
        )}
      </div>
    </section>
  );
};
