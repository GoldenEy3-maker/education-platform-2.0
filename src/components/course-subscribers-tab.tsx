import { type Prisma } from "@prisma/client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import React from "react"
import {
  BiBookmarkMinus,
  BiDotsVerticalRounded,
  BiMessageAlt,
  BiRightArrowAlt,
  BiSearch,
  BiSortAlt2,
} from "react-icons/bi"
import { type ValueOf } from "~/libs/utils"
import { Avatar } from "./avatar"
import { CircularProgress } from "./circular-progress"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Input } from "./ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Skeleton } from "./ui/skeleton"

const SortValueSubscribersMap = {
  Recent: "Recent",
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const SortValueSubscribersContentMap: Record<SortValueSubscribersMap, string> =
  {
    Recent: "Недавним",
    Alphabet: "Алфавиту",
    Progress: "Прогрессу",
  } as const;

export type SortValueSubscribersMap = ValueOf<typeof SortValueSubscribersMap>;

const SubscriberSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-md border bg-background p-4">
      <div className="flex flex-col items-center">
        <Skeleton className="mb-1 h-16 w-16 rounded-full" />
        <Skeleton className="mb-1 h-5 w-28 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
      </div>
      <div className="my-4 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Skeleton className="mb-1 h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress
            className="text-2xl text-primary"
            strokeWidth={8}
            value={0}
          />
          <Skeleton className="mt-1 h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
};

type CourseSubscribersTabProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  sortValue: SortValueSubscribersMap;
  onSortValueChange: (value: SortValueSubscribersMap) => void;
  subscribers: Prisma.SubscriptionGetPayload<{
    include: {
      user: {
        select: {
          id: true;
          name: true;
          surname: true;
          image: true;
          email: true;
        };
      };
    };
  }>[];
  isAuthor: boolean;
  isLoading: boolean;
};

export const CourseSubscribersTab: React.FC<CourseSubscribersTabProps> = ({
  sortValue,
  onSortValueChange,
  searchValue,
  onSearchValueChange,
  subscribers,
  isAuthor,
  isLoading,
}) => {
  const { data: session } = useSession();

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск участников..."
          className="max-w-64"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={!session?.user}
        />
        <Select
          defaultValue={SortValueSubscribersMap.Recent}
          value={sortValue}
          onValueChange={onSortValueChange}
        >
          <Button
            asChild
            variant="outline"
            className="w-auto justify-between gap-2 max-[1100px]:border-none max-[1100px]:bg-transparent max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
            disabled={!session?.user}
          >
            <SelectTrigger>
              <BiSortAlt2 className="shrink-0 text-xl min-[1100px]:hidden" />
              <p className="max-[1100px]:hidden">
                <span className="text-muted-foreground">Сортировать по</span>
                &nbsp;
                <SelectValue />
              </p>
            </SelectTrigger>
          </Button>
          <SelectContent>
            {Object.entries(SortValueSubscribersContentMap).map(
              ([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-4">
        {!isLoading ? (
          subscribers.length > 0 &&
          subscribers.map((sub) => (
            <div
              key={sub.id}
              className="relative rounded-md border bg-background p-4"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 rounded-full data-[state=open]:bg-accent"
                  >
                    <BiDotsVerticalRounded className="text-xl" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <BiMessageAlt className="mr-2 text-xl" />
                      <span>Перейти в чат</span>
                    </Button>
                  </DropdownMenuItem>
                  {isAuthor ? (
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost-destructive"
                        className="w-full justify-start hover:!bg-destructive/15 hover:!text-destructive focus-visible:!text-destructive focus-visible:!bg-destructive/15"
                      >
                        <BiBookmarkMinus className="mr-2 text-xl" />
                        <span>Отписать</span>
                      </Button>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex flex-col items-center ">
                <Avatar fallback="КД" className="h-16 w-16" />
                <p className="font-medium">
                  {sub.user.surname} {sub.user.name}
                </p>
                <span className="text-sm text-muted-foreground">
                  {sub.user.email}
                </span>
              </div>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <p className="font-medium">3</p>
                  <span className="text-sm text-muted-foreground">
                    Завершено
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <CircularProgress
                    className="text-2xl text-primary"
                    strokeWidth={8}
                    value={sub.progress}
                  />
                  <span className="text-sm text-muted-foreground">
                    Прогресс ({sub.progress}%)
                  </span>
                </div>
              </div>
              <footer className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  К.105с11-5
                </span>
                <Button variant="link" asChild className="gap-2">
                  <Link href="#">
                    <span>Профиль</span>
                    <BiRightArrowAlt className="text-xl" />
                  </Link>
                </Button>
              </footer>
            </div>
          ))
        ) : (
          <>
            <SubscriberSkeleton />
            <SubscriberSkeleton />
            <SubscriberSkeleton />
            <SubscriberSkeleton />
          </>
        )}
      </div>
    </div>
  );
};
