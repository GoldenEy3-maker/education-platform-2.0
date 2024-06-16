import { type Prisma } from "@prisma/client";
import Link from "next/link";
import { type CSSProperties } from "react";
import {
  BiBookmarkMinus,
  BiBookmarkPlus,
  BiDotsVerticalRounded,
  BiPlus,
  BiShareAlt,
  BiSliderAlt,
  BiSolidStar,
  BiStar,
  BiUserPlus,
} from "react-icons/bi";
import {
  PagePathMap,
  StatusCourseContentMap,
  type StatusCourseMap,
} from "~/libs/enums";
import { cn, getFirstLettersUserCredentials } from "~/libs/utils";
import { Avatar } from "../avatar";
import { InviteDialogDrawer } from "../invite-dialog-drawer";
import { ShareDialogDrawer } from "../share-dialog-drawer";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import { api } from "~/libs/api";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { TbBallpen, TbBook2, TbListDetails, TbUserCheck } from "react-icons/tb";
import { useRouter } from "next/router";

type CourseHeadProps = {
  id: string;
  title: string;
  progress?: number | null;
  author:
    | {
        id: string;
        fathername: string | null;
        surname: string;
        name: string;
        status: string | null;
        image: string | null;
      }
    | undefined;
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
  isFavorite: boolean;
};

export const CourseHead: React.FC<CourseHeadProps> = ({
  isAuthor,
  isSubStudent,
  isTeacher,
  isArchived,
  isLoading,
  isFavorite,
  author,
  subscribers,
  title,
  id,
  progress,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const status: StatusCourseMap = isArchived ? "Archived" : "Published";

  const utils = api.useUtils();

  const subscribeCourseMutation = api.course.subscribe.useMutation({
    onMutate: async ({ courseId }) => {
      await utils.course.getById.cancel();

      const prevData = utils.course.getById.getData();

      utils.course.getById.setData({ id }, (old) => ({
        ...old!,
        subscribers: [
          ...(old?.subscribers ?? []),
          {
            id: crypto.randomUUID(),
            userId: session!.user.id,
            progress: 0,
            courseId: courseId,
            user: { ...session!.user },
          },
        ],
      }));

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getById.setData({ id }, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getById.invalidate();
    },
  });

  const unsubscribeCourseMutation = api.course.unsubscribe.useMutation({
    onMutate: async () => {
      await utils.course.getById.cancel();

      const prevData = utils.course.getById.getData();

      utils.course.getById.setData({ id }, (old) => ({
        ...old!,
        subscribers: (old?.subscribers ?? []).filter(
          (sub) => sub.userId !== session?.user.id,
        ),
      }));

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getById.setData({ id }, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getById.invalidate();
    },
  });

  const favoriteCourseMutation = api.course.favorite.useMutation({
    onMutate: async () => {
      await utils.course.getById.cancel();

      const prevData = utils.course.getById.getData();

      utils.course.getById.setData({ id }, (old) => ({
        ...old!,
        favoritedBy: [
          ...(old?.favoritedBy ?? []),
          {
            id: crypto.randomUUID(),
            userId: session!.user.id,
          },
        ],
      }));

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getById.setData({ id }, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getById.invalidate();
    },
  });

  const unfavoriteCourseMutation = api.course.unfavorite.useMutation({
    onMutate: async () => {
      await utils.course.getById.cancel();

      const prevData = utils.course.getById.getData();

      utils.course.getById.setData({ id }, (old) => ({
        ...old!,
        favoritedBy: (old?.favoritedBy ?? []).filter(
          (fav) => fav.userId !== session?.user.id,
        ),
      }));

      return { prevData };
    },
    onError: async (error, data, ctx) => {
      utils.course.getById.setData({ id }, ctx?.prevData);
      toast.error(error.message);
    },
    onSettled: () => {
      void utils.course.getById.invalidate();
    },
  });

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
      <h1 className="mb-1 text-2xl font-medium [text-wrap:balance]">{title}</h1>
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
            <Progress value={progress} />
            <span className="whitespace-nowrap text-muted-foreground">
              {progress}% завершено
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
            <Link href={PagePathMap.Profile + author?.id}>
              <Avatar
                fallback={getFirstLettersUserCredentials(
                  author?.surname ?? "",
                  author?.name ?? "",
                )}
                src={author?.image}
                className="row-span-2 h-10 w-10"
              />
              <p className="truncate font-medium">
                {author?.surname} {author?.name} {author?.fathername}
              </p>
              <span className="truncate text-sm text-muted-foreground">
                {author?.status}
              </span>
            </Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full max-[570px]:hidden"
          size="icon"
          onClick={() => {
            if (isFavorite) {
              unfavoriteCourseMutation.mutate({ courseId: id });
            } else {
              favoriteCourseMutation.mutate({ courseId: id });
            }
          }}
          disabled={
            unfavoriteCourseMutation.isLoading ||
            favoriteCourseMutation.isLoading
          }
        >
          {isFavorite ? (
            <>
              <BiSolidStar className="text-xl text-warning" />
              <span className="sr-only">Убрать из избранного</span>
            </>
          ) : (
            <>
              <BiStar className="text-xl text-warning" />
              <span className="sr-only">Добавь в избранное</span>
            </>
          )}
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
                  className="rounded-full border-[4px] border-background max-lg:hidden"
                />
              ))}
          {subscribers.length > 4 ? (
            <div className="z-20 hidden h-12 w-12 items-center justify-center rounded-full border-[4px] border-background bg-accent lg:flex">
              +{subscribers.length - 4}
            </div>
          ) : null}
          {isAuthor ? (
            <InviteDialogDrawer>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full border-dashed border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary lg:ml-3",
                  {
                    "!ml-0": subscribers.length < 3,
                  },
                )}
              >
                <BiUserPlus className="text-xl" />
                <span className="sr-only">Пригласить</span>
              </Button>
            </InviteDialogDrawer>
          ) : null}
        </div>
        {(() => {
          if (isAuthor)
            return (
              <Button
                asChild
                variant="outline"
                className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
              >
                <Link href={PagePathMap.EditCourse + id}>
                  <BiSliderAlt className="shrink-0 text-xl" />
                  <span className="max-lg:hidden">Редактировать</span>
                  <span className="sr-only">Редактировать</span>
                </Link>
              </Button>
            );

          if (isSubStudent)
            return (
              <Button
                variant="outline"
                className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
                disabled={
                  unsubscribeCourseMutation.isLoading ||
                  subscribeCourseMutation.isLoading
                }
                onClick={() =>
                  unsubscribeCourseMutation.mutate({ courseId: id })
                }
              >
                <TbUserCheck className="hidden shrink-0 text-xl max-lg:inline-block" />
                <span className="max-lg:hidden">Вы подписаны</span>
                <span className="sr-only">Вы подписаны</span>
              </Button>
            );

          return (
            <Button
              variant="default"
              className="gap-2 max-lg:h-10 max-lg:w-10 max-lg:rounded-full max-[570px]:hidden"
              disabled={
                (isTeacher && !isAuthor) ||
                subscribeCourseMutation.isLoading ||
                unsubscribeCourseMutation.isLoading
              }
              onClick={() => subscribeCourseMutation.mutate({ courseId: id })}
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
            <DropdownMenuLabel>Дополнительное меню</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(event) => event.preventDefault()}
                asChild
              >
                <Button
                  variant="ghost"
                  disabled={
                    favoriteCourseMutation.isLoading ||
                    unfavoriteCourseMutation.isLoading
                  }
                  onClick={() => {
                    if (isFavorite) {
                      unfavoriteCourseMutation.mutate({ courseId: id });
                    } else {
                      favoriteCourseMutation.mutate({ courseId: id });
                    }
                  }}
                  className="w-full justify-start"
                >
                  {isFavorite ? (
                    <>
                      <BiSolidStar className="mr-2 text-lg text-warning" />
                      <span>Убрать из избранного</span>
                    </>
                  ) : (
                    <>
                      <BiStar className="mr-2 text-lg text-warning" />
                      <span>Добавить в избранное</span>
                    </>
                  )}
                </Button>
              </DropdownMenuItem>
              <ShareDialogDrawer>
                <DropdownMenuItem
                  asChild
                  onSelect={(event) => event.preventDefault()}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    <BiShareAlt className="mr-2 text-lg" />
                    <span>Поделиться</span>
                  </Button>
                </DropdownMenuItem>
              </ShareDialogDrawer>
              {isAuthor ? (
                <>
                  <InviteDialogDrawer>
                    <DropdownMenuItem
                      asChild
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Button className="w-full justify-start" variant="ghost">
                        <BiUserPlus className="mr-2 text-lg" />
                        <span>Пригласить</span>
                      </Button>
                    </DropdownMenuItem>
                  </InviteDialogDrawer>
                  <DropdownMenuSub>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start rounded-sm px-2"
                    >
                      <DropdownMenuSubTrigger>
                        <BiPlus className="mr-2 text-lg" />
                        <span>Новое задание</span>
                      </DropdownMenuSubTrigger>
                    </Button>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent sideOffset={-130}>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              href={
                                router.query.courseId &&
                                typeof router.query.courseId === "string"
                                  ? PagePathMap.CreateLec +
                                    "?courseId=" +
                                    router.query.courseId
                                  : PagePathMap.CreateLec
                              }
                            >
                              <TbBook2 className="mr-2 text-xl" />
                              <span>Лекционный материал</span>
                            </Link>
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              href={
                                router.query.courseId &&
                                typeof router.query.courseId === "string"
                                  ? PagePathMap.CreateQuiz +
                                    "?courseId=" +
                                    router.query.courseId
                                  : PagePathMap.CreateQuiz
                              }
                            >
                              <TbListDetails className="mr-2 text-xl" />
                              <span>Тестирование</span>
                            </Link>
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                          >
                            <Link
                              href={
                                router.query.courseId &&
                                typeof router.query.courseId === "string"
                                  ? PagePathMap.CreatePract +
                                    "?courseId=" +
                                    router.query.courseId
                                  : PagePathMap.CreatePract
                              }
                            >
                              <TbBallpen className="mr-2 text-xl" />
                              <span>Практическая работа</span>
                            </Link>
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={PagePathMap.EditCourse + id}>
                        <BiSliderAlt className="mr-2 text-lg" />
                        <span>Редактировать</span>
                      </Link>
                    </Button>
                  </DropdownMenuItem>
                </>
              ) : isSubStudent ? (
                <DropdownMenuItem
                  onSelect={(event) => event.preventDefault()}
                  asChild
                >
                  <Button
                    variant={"ghost-destructive"}
                    className="w-full justify-start hover:!bg-destructive/15 hover:!text-destructive"
                    disabled={
                      unsubscribeCourseMutation.isLoading ||
                      subscribeCourseMutation.isLoading
                    }
                    onClick={() =>
                      unsubscribeCourseMutation.mutate({ courseId: id })
                    }
                  >
                    <BiBookmarkMinus className="mr-2 text-lg" />
                    <span>Отписаться</span>
                  </Button>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  asChild
                  onSelect={(event) => event.preventDefault()}
                >
                  <Button
                    variant="ghost"
                    disabled={
                      (!isAuthor && isTeacher) ||
                      subscribeCourseMutation.isLoading ||
                      unsubscribeCourseMutation.isLoading
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      subscribeCourseMutation.mutate({ courseId: id })
                    }
                  >
                    <BiBookmarkPlus className="mr-2 text-lg" />
                    <span>Подписаться</span>
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
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
