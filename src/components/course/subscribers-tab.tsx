import { type Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo } from "react";
import { BiGroup, BiSearch, BiSortAlt2 } from "react-icons/bi";
import { prepareSearchMatching, type ValueOf } from "~/libs/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CourseEmptyTab } from "./empty-tab";
import { SubscriberItem, SubscriberItemSkeleton } from "./subscriber-item";

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
          fathername: true;
          name: true;
          surname: true;
          image: true;
          email: true;
          group: true;
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

  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((sub) => {
        const value = prepareSearchMatching(searchValue);
        const group = prepareSearchMatching(sub.user.group?.name ?? "");

        const credentials = prepareSearchMatching(
          `${sub.user.surname} ${sub.user.name} ${sub.user.fathername ?? ""}`,
        );
        const email = prepareSearchMatching(sub.user.email ?? "");

        return (
          group.includes(value) ||
          credentials.includes(value) ||
          email.includes(value)
        );
      }),
    [searchValue, subscribers],
  );

  if (subscribers.length === 0 && !isLoading)
    return (
      <CourseEmptyTab
        icon={<BiGroup className="text-7xl text-muted-foreground" />}
        text={
          isAuthor ? (
            <p>
              Похоже, что на ваш курс еще никто не подписан.{" "}
              <span className="text-primary">
                Вы можете разослать приглашения самостоятельно
              </span>
              . В случае если вы уверены, что участиники курса все же есть, но
              тут они не отображаются, тогда проблема остается на нашей стороне.
              Попробуйте вернуться позже. Мы вас всегда ждем!
            </p>
          ) : session?.user.role === "Teacher" ? (
            <p>
              Похоже, что на этом курсе еще нет участников. Надеемся, в скором
              времени они появятся. Так как вы являетесь преподавателем, вы не
              можете подписаться на этот курс.{" "}
              <Link href="#" className="text-primary">
                Однако вы всегда можете создать свой собственный курс
              </Link>
              .
            </p>
          ) : (
            <p>
              Похоже, что на этом курсе еще нет участников. Вы можете стать
              первым из них.{" "}
              <span className="text-primary">
                Просто отправьте приглашение преподавателю курса
              </span>
              .
            </p>
          )
        }
      />
    );

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск участников..."
          className="max-w-64"
          value={searchValue}
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={isLoading}
        />
        <Select
          defaultValue={SortValueSubscribersMap.Recent}
          value={sortValue}
          onValueChange={onSortValueChange}
        >
          <Button
            asChild
            variant="outline"
            className="w-auto justify-between gap-2 bg-transparent max-[1100px]:border-none max-[1100px]:px-2 max-[1100px]:shadow-none min-[1100px]:min-w-[15.5rem]"
            disabled={isLoading}
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
          filteredSubscribers.length > 0 ? (
            filteredSubscribers.map((sub) => (
              <SubscriberItem
                key={sub.id}
                isAuthor={isAuthor}
                progress={sub.progress}
                user={sub.user}
              />
            ))
          ) : (
            <CourseEmptyTab
              className="col-span-4"
              icon={<BiGroup className="text-7xl text-muted-foreground" />}
              text={<p>Нет результатов.</p>}
            />
          )
        ) : (
          <>
            <SubscriberItemSkeleton />
            <SubscriberItemSkeleton />
            <SubscriberItemSkeleton />
            <SubscriberItemSkeleton />
          </>
        )}
      </div>
    </div>
  );
};
