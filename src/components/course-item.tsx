import Link from "next/link";
import { BiRightArrowAlt, BiSolidStar, BiStar } from "react-icons/bi";
import {
  type StatusCourseMap,
  PagePathMap,
  StatusCourseContentMap,
} from "~/libs/enums";
import {
  cn,
  getFirstLettersUserCredentials,
  getPersonInitials,
} from "~/libs/utils";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

type CourseItemProps = {
  id: string;
  title: string;
  image?: string;
  status?: StatusCourseMap;
  progress?: number;
  isFavorited?: boolean;
  author: {
    surname: string;
    name: string;
    id: string;
    fathername: string | null;
    image: string | null;
  };
} & React.ComponentProps<"div">;

export const CourseItem: React.FC<CourseItemProps> = ({
  id,
  title,
  image,
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
      {status ? (
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
            <span>{StatusCourseContentMap[status]}</span>
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
      ) : null}
      <h4 className="mb-1 line-clamp-2 text-lg font-medium">{title}</h4>
      {/* <p
        className={cn("mb-auto line-clamp-2 text-muted-foreground", {
          "line-clamp-4": !progress,
        })}
      >
        {description}
      </p> */}
      {progress ? (
        <div className="mt-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ) : null}
      <footer className="mt-auto flex items-center justify-between gap-2 overflow-hidden pt-3">
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

export const CourseItemSkeleton: React.FC = () => {
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
