import { type Prisma } from "@prisma/client";
import Link from "next/link";
import { type CSSProperties } from "react";
import {
  BiBookmarkMinus,
  BiBookmarkPlus,
  BiDotsVerticalRounded,
  BiShareAlt,
  BiSliderAlt,
  BiStar,
  BiUserPlus,
} from "react-icons/bi";
import { StatusCourseContentMap, type StatusCourseMap } from "~/libs/enums";
import { cn, getFirstLettersUserCredentials } from "~/libs/utils";
import { Avatar } from "./avatar";
import { ShareDialogDrawer } from "./share-dialog-drawer";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

type CourseHeadProps = {
  title: string;
  author: {
    id: string;
    fathername: string | null;
    surname: string;
    name: string;
    status: string | null;
    image: string | null;
  };
  subscribers: Prisma.SubscriptionGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          surname: true;
          fathername: true;
          image: true;
          email: true;
        };
      };
    };
  }>[];
  isAuthor: boolean;
  isSubStudent: boolean;
  isTeacher: boolean;
  isLoading: boolean;
  isArchived: boolean;
};

export const CourseHead: React.FC<CourseHeadProps> = ({
  isAuthor,
  isSubStudent,
  isTeacher,
  isArchived,
  isLoading,
  author,
  subscribers,
  title,
}) => {
  const status: StatusCourseMap = isArchived ? "Archived" : "Published";

  return !isLoading ? (
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
        <span>{StatusCourseContentMap[status]}</span>
      </div>
      <h1 className="mb-2 text-3xl font-medium [text-wrap:balance]">{title}</h1>
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

        if (!isSubStudent)
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
              subscribers.length < 3 && !isAuthor,
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
                {author.surname} {author.name} {author.fathername}
              </p>
              <span className="truncate text-sm text-muted-foreground">
                {author.status}
              </span>
            </Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full max-[570px]:hidden"
          size="icon"
        >
          <BiStar className="text-xl text-warning" />
          <span className="sr-only">Добавь в избранное</span>
        </Button>
        <ShareDialogDrawer>
          <Button
            type="button"
            variant="ghost"
            className="rounded-full max-[570px]:hidden"
            size="icon"
          >
            <BiShareAlt className="text-xl" />
            <span className="sr-only">Поделиться</span>
          </Button>
        </ShareDialogDrawer>
        <div
          style={
            {
              "--subscribers-length": subscribers.length,
            } as CSSProperties
          }
          className={cn(
            "grid grid-cols-[repeat(var(--subscribers-length),minmax(0,2.4rem))] items-center pr-2 max-lg:hidden",
            {
              "grid-cols-1 pr-0 max-lg:block max-[570px]:hidden lg:grid-cols-[repeat(var(--subscribers-length),minmax(0,2.4rem))_auto]":
                isAuthor,
              "grid-cols-[repeat(5,minmax(0,2.4rem))]": subscribers.length > 4,
              "grid-cols-1 lg:grid-cols-[repeat(5,minmax(0,2.4rem))_auto]":
                subscribers.length > 4 && isAuthor,
              hidden: subscribers.length < 3 && !isAuthor,
              "grid-cols-1": subscribers.length < 3 && isAuthor,
            },
          )}
        >
          {subscribers.length > 2 &&
            subscribers
              .slice(0, 4)
              .map((sub) => (
                <Avatar
                  key={sub.id}
                  fallback={getFirstLettersUserCredentials(
                    sub.user.surname,
                    sub.user.name,
                  )}
                  src={sub.user.image}
                  className="rounded-full border-[4px] border-[hsla(213,39%,95%)] dark:border-[hsl(220,67%,13%)] max-lg:hidden"
                />
              ))}
          {subscribers.length > 4 ? (
            <div className="z-20 hidden h-12 w-12 items-center justify-center rounded-full border-[4px] border-[hsla(213,39%,95%)] bg-accent dark:border-[hsl(220,67%,13%)] lg:flex">
              +{subscribers.length - 4}
            </div>
          ) : null}
          {isAuthor ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full border-dashed border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary lg:ml-3",
                {
                  "ml-0": subscribers.length < 3,
                },
              )}
            >
              <BiUserPlus className="text-xl" />
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
            <DropdownMenuItem>
              <BiStar className="mr-2 text-xl text-warning" />
              <span>Добавить в избранное</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ShareDialogDrawer>
                <Button variant="ghost" className="w-full justify-start">
                  <BiShareAlt className="mr-2 text-xl" />
                  <span>Поделиться</span>
                </Button>
              </ShareDialogDrawer>
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
  );
};
