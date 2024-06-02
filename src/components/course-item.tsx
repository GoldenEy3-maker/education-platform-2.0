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
import Image from "next/image";
import { type Descendant } from "slate";
import { serializeHTML } from "./editor/utils";
import { api } from "~/libs/api";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type CourseItemProps = {
  id: string;
  title: string;
  image: string;
  status?: StatusCourseMap;
  progress?: number;
  description?: string | null;
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
  description,
  isFavorited,
  author,
  className,
  ...props
}) => {
  const { data: session } = useSession();

  const utils = api.useUtils();

  const courseToFavoriteMutation = api.course.toFavorite.useMutation({
    onMutate: async ({ courseId }) => {
      await utils.course.getAll.cancel();

      const prevData = utils.course.getAll.getData();

      utils.course.getAll.setData(undefined, (old) =>
        old?.map((course) => {
          if (course.id === courseId) {
            return { ...course, favoritedBy: [{ userId: session!.user.id }] };
          }

          return course;
        }),
      );

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getAll.setData(undefined, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getAll.invalidate();
    },
  });

  const courseRemoveFavoriteMutation = api.course.removeFavorite.useMutation({
    onMutate: async ({ courseId }) => {
      await utils.course.getAll.cancel();

      const prevData = utils.course.getAll.getData();

      utils.course.getAll.setData(undefined, (old) =>
        old?.map((course) => {
          if (course.id === courseId) {
            return {
              ...course,
              favoritedBy: course.favoritedBy.filter(
                (fav) => fav.userId !== session?.user.id,
              ),
            };
          }

          return course;
        }),
      );

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getAll.setData(undefined, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getAll.invalidate();
    },
  });

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Link
        href={PagePathMap.Course + id}
        className="relative mb-3 h-56 w-full  overflow-hidden rounded-lg "
      >
        <Skeleton className="absolute inset-0" />
        <Image src={image} alt="Фоновое изображение" className="z-10" fill />
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
            disabled={
              courseToFavoriteMutation.isLoading ||
              courseRemoveFavoriteMutation.isLoading
            }
            onClick={() => {
              if (isFavorited) {
                courseRemoveFavoriteMutation.mutate({ courseId: id });
              } else {
                courseToFavoriteMutation.mutate({ courseId: id });
              }
            }}
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
      {description ? (
        <div
          className={cn("mb-auto line-clamp-2 text-muted-foreground", {
            "line-clamp-4": progress === undefined,
          })}
          dangerouslySetInnerHTML={{
            __html: (JSON.parse(description) as Descendant[])
              .map((node) => serializeHTML(node))
              .join(""),
          }}
        />
      ) : null}
      {progress !== undefined ? (
        <div className="mt-auto pt-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      ) : null}
      <footer
        className={cn(
          "flex items-center justify-between gap-2 overflow-hidden pt-3",
          {
            "mt-auto": progress === undefined,
          },
        )}
      >
        <Button
          className="h-auto w-fit justify-normal gap-3 px-2 py-1"
          variant="ghost"
          asChild
        >
          <Link href={PagePathMap.Profile + author.id}>
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
