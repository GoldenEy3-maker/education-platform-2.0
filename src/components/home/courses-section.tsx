import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiBook, BiChevronRight, BiSolidFileFind } from "react-icons/bi";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CourseItem, CourseItemSkeleton } from "./course-item";

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
  const { data: session, status } = useSession();
  const isLoading = status === "loading" || !session?.user;
  const isEmpty = false;

  return (
    <section className="row-span-2 overflow-hidden rounded-lg border bg-background px-4 py-3 shadow">
      <header className="flex items-center gap-2 pb-3">
        <BiBook className="text-xl" />
        <h4 className="flex-grow text-lg font-semibold">Курсы</h4>
        <Button variant="outline" type="button" asChild className="gap-2">
          <Link href="#">
            <span>Смотреть все</span>
            <BiChevronRight className="text-xl" />
          </Link>
        </Button>
      </header>
      <Separator />
      <div className="custom-scrollbar mt-3 max-h-[30rem] space-y-1 overflow-auto min-[1120px]:max-h-[36.5rem] 2xl:max-h-[calc(100vh-11.5rem)]">
        {!isLoading ? (
          !isEmpty ? (
            <>
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                id="123"
                progress={20}
              />
            </>
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
