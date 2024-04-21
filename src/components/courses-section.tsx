import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiBook, BiSolidFileFind } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { CircularProgress } from "./circular-progress";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type CourseItemProps = {
  href: string;
  title: string;
  thumbnail?: string;
  author: { surname: string; name: string; fathername?: string };
  progressValue?: number;
  className?: string;
};

const CourseItem: React.FC<CourseItemProps> = ({ href = "#", ...props }) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3",
        props.className,
      )}
    >
      <Link href={href}>
        <Avatar
          fallback={props.title.at(0)}
          src={props.thumbnail}
          className="row-span-2"
        />
        <p className="truncate text-base">{props.title}</p>
        <div className="col-start-2 row-start-2 flex items-center gap-2 overflow-hidden">
          <span className="truncate text-muted-foreground">
            {props.author.surname} {props.author.name.at(0)}.{" "}
            {props.author.fathername?.at(0)}.
          </span>
          {props.progressValue ? (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <CircularProgress
                    value={props.progressValue}
                    strokeWidth={7}
                    className="text-xl text-primary"
                  />
                </TooltipTrigger>
                <TooltipContent>{props.progressValue}%</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </Link>
    </Button>
  );
};

const CourseItemSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 px-4 py-2">
      <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
      <Skeleton className="h-3 w-40 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
};

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
    <section className="row-span-2 overflow-hidden rounded-lg border bg-background/60 px-4 py-3 shadow">
      <header className="flex items-center gap-2 pb-3">
        <BiBook className="text-xl" />
        <h4 className="flex-grow text-lg font-medium">Курсы</h4>
        <Button variant="outline" type="button" asChild>
          <Link href="#">Смотреть все</Link>
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
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
              />
              <CourseItem
                title="Иностранный язык в профессиональной деятельности"
                author={{
                  surname: "Демкина",
                  name: "Людмила",
                  fathername: "Михайловна",
                }}
                href="#"
                progressValue={20}
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
