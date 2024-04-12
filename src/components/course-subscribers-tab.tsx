// TODO: handle isLoading prop
import { type Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";
import {
  BiBookmarkMinus,
  BiDotsVerticalRounded,
  BiMessageAlt,
  BiRightArrowAlt,
  BiSearch,
  BiSortAlt2,
} from "react-icons/bi";
import { type ValueOf } from "~/libs/utils";
import { Avatar } from "./avatar";
import { ProgressCircle } from "./progress-circle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SortValueSubscribersMap = {
  Recent: "Recent",
  Alphabet: "Alphabet",
  Progress: "Progress",
} as const;

const TranslatedSortValueSubscribersMap: Record<
  SortValueSubscribersMap,
  string
> = {
  Recent: "Недавним",
  Alphabet: "Алфавиту",
  Progress: "Прогрессу",
} as const;

export type SortValueSubscribersMap = ValueOf<typeof SortValueSubscribersMap>;

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
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск участников..."
          className="max-w-80"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
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
            {Object.entries(TranslatedSortValueSubscribersMap).map(
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
        {subscribers.length > 0 &&
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
                  <DropdownMenuItem>
                    <BiMessageAlt className="mr-2 text-xl" />
                    <span>Перейти в чат</span>
                  </DropdownMenuItem>
                  {isAuthor ? (
                    <DropdownMenuItem>
                      <BiBookmarkMinus className="mr-2 text-xl" />
                      <span>Отписать</span>
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
                  <ProgressCircle
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
          ))}
      </div>
    </div>
  );
};