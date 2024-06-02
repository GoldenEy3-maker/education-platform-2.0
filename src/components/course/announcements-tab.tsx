import { type Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo } from "react";
import {
  BiConversation,
  BiExpandVertical,
  BiPlus,
  BiSearch,
  BiTrash,
} from "react-icons/bi";
import { handleAttachment, prepareSearchMatching } from "~/libs/utils";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { CourseEmptyTab } from "./empty-tab";

const AnnouncementSkeleton: React.FC = () => {
  return (
    <div>
      <div className="px-4 py-2">
        <Skeleton className="h-5 w-52 rounded-full" />
      </div>
      <div className="space-y-1 px-4 py-3">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>
    </div>
  );
};

type CourseAnnouncementsTabProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  isLoading: boolean;
  isAuthor: boolean;
  announcements: Prisma.AnnouncementGetPayload<{
    include: { attachments: true };
  }>[];
};

export const CourseAnnouncementsTab: React.FC<CourseAnnouncementsTabProps> = ({
  onSearchValueChange,
  searchValue,
  isAuthor,
  isLoading,
  announcements,
}) => {
  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter((announcement) => {
        const value = prepareSearchMatching(searchValue);
        const title = prepareSearchMatching(announcement.title);
        const text = prepareSearchMatching(announcement.text);
        const createdAt = dayjs(announcement.createdAt);
        const formatedCreatedAt = prepareSearchMatching(
          createdAt.format("DD MMMM YYYY, HH:mm:ss"),
        );
        const isoCreatedAt = prepareSearchMatching(createdAt.toISOString());
        const dateCreatedAt = prepareSearchMatching(createdAt.toString());

        return (
          title.includes(value) ||
          text.includes(value) ||
          formatedCreatedAt.includes(value) ||
          isoCreatedAt.includes(value) ||
          dateCreatedAt.includes(value)
        );
      }),
    [announcements, searchValue],
  );

  if (announcements.length === 0 && !isLoading)
    return (
      <CourseEmptyTab
        icon={<BiConversation className="text-7xl text-muted-foreground" />}
        text={
          isAuthor ? (
            <p>
              Похоже, что вы еще не делали ни одного объявления на курсе. Если у
              вас есть информация, которую вы хотите сообщить всем участникам
              курса, тогда{" "}
              <span className="text-primary">
                можете создать новое объявление тут
              </span>
              . В случае если вы уже создавали объявления, но тут они не
              отобразились, тогда проблема остается на нашей стороне. Попробуйте
              вернуться позже. Мы вас всегда ждем!
            </p>
          ) : (
            <p>
              Похоже, что преподаватель курса еще не делал объявленией. Если
              преподаватель опубликует новое объявление, вы сразу же получите
              уведомление. Поэтому попробуй вернуться позже. Мы вас всегда ждем!
            </p>
          )
        }
      />
    );

  return (
    <div>
      <div className="mb-4 grid grid-cols-[1fr_auto] items-center gap-2">
        <Input
          leadingIcon={<BiSearch className="text-xl" />}
          placeholder="Поиск объявлений..."
          value={searchValue}
          className="max-w-64"
          onChange={(event) => onSearchValueChange(event.target.value)}
          disabled={isLoading}
        />
        {isAuthor ? (
          <Button className="gap-2 max-md:w-10 max-md:rounded-full">
            <BiPlus className="shrink-0 text-xl" />
            <span className="max-md:hidden">Создать новое</span>
            <span className="sr-only md:hidden">Создать новое объявление</span>
          </Button>
        ) : null}
      </div>
      <div className="space-y-2">
        {!isLoading ? (
          filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Collapsible key={announcement.id}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="grid h-auto w-full grid-cols-[1fr_auto] gap-x-2 border-b text-left max-sm:grid-rows-[auto_auto] sm:grid-cols-[auto_1fr_auto]"
                  >
                    <p className="truncate text-base font-medium">
                      {announcement.title}
                    </p>
                    <span className="truncate capitalize text-muted-foreground max-sm:row-start-2">
                      (
                      {dayjs(announcement.createdAt).format(
                        "DD MMMM YYYY, HH:mm:ss",
                      )}
                      )
                    </span>
                    <BiExpandVertical className="max-sm:row-span-2" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pb-2">
                    <div className="flex gap-2">
                      <div>
                        <p>{announcement.text}</p>
                      </div>
                      {isAuthor ? (
                        <Button
                          variant="ghost-destructive"
                          className="shrink-0 rounded-full"
                          size="icon"
                        >
                          <BiTrash className="text-xl" />
                        </Button>
                      ) : null}
                    </div>
                    {announcement.attachments &&
                    announcement.attachments.length > 0 ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {announcement.attachments.map((attachment) => {
                          const [name, template] = handleAttachment({
                            name: attachment.name,
                            isLink: !attachment.key,
                          });

                          return (
                            <Button
                              key={attachment.id}
                              variant="outline"
                              className="gap-2"
                              asChild
                            >
                              <Link href="#">
                                <span className="text-xl">{template.icon}</span>
                                <span>{name}</span>
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <CourseEmptyTab
              icon={
                <BiConversation className="text-7xl text-muted-foreground" />
              }
              text={<p>Нет результатов.</p>}
            />
          )
        ) : (
          <>
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
            <AnnouncementSkeleton />
          </>
        )}
      </div>
    </div>
  );
};
