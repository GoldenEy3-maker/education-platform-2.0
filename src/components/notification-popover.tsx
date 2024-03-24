import { type User } from "@prisma/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BiBell, BiCog } from "react-icons/bi";
import { cn, type ValueOf } from "~/libs/utils";
import { Avatar } from "./avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const TabsMap = {
  Inbox: "inbox",
  General: "general",
};

type TabsMap = ValueOf<typeof TabsMap>;

type NotificationItemProps = {
  sender: Omit<User, "password" | "tokenVersion">;
  title: string;
  date: Date;
  theme: string;
  isInbox: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  sender,
  title,
  date,
  theme,
  isInbox,
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      type="button"
      className={cn(
        "grid h-auto grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] justify-start gap-x-3 text-base",
        {
          "grid-cols-[auto_1fr]": !isInbox,
        },
      )}
    >
      <Link href="#">
        <Avatar
          fallback={sender.name?.at(0)}
          src={sender.image}
          isOnline
          className="row-span-2"
        />
        <p className="truncate text-muted-foreground">
          <span className="font-medium text-foreground">{title}</span> отправил
          уведомление
        </p>
        <p className="col-start-2 row-start-2 truncate text-sm text-muted-foreground">
          <span>{dayjs(date).fromNow()}</span>
          &nbsp; &#9679; &nbsp;
          <span>{theme}</span>
        </p>
        {isInbox ? (
          <div className="row-span-2 flex items-center justify-center">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </div>
        ) : null}
      </Link>
    </Button>
  );
};

export const NotificationPopover = () => {
  const { data: session } = useSession();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" type="button" size="icon">
          <BiBell className="text-xl" />
          <Badge className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs">
            99
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[26rem] overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <header className="flex items-center justify-between gap-2">
          <p className="font-medium">Уведомления</p>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Прочитать все
          </Button>
        </header>
        {session?.user ? (
          <Tabs defaultValue={TabsMap.Inbox}>
            <div className="mt-3 flex items-center justify-between gap-2 border-b">
              <TabsList className="h-auto bg-transparent p-0">
                <TabsTrigger
                  className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:bg-accent"
                  value={TabsMap.Inbox}
                  asChild
                >
                  <Button type="button" variant="ghost">
                    Входящие
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs group-data-[state='active']:bg-primary group-data-[state='active']:text-primary-foreground">
                      1
                    </div>
                  </Button>
                </TabsTrigger>
                <TabsTrigger
                  className="group h-auto gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:bg-accent"
                  value={TabsMap.General}
                  asChild
                >
                  <Button type="button" variant="ghost">
                    Общие
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs group-data-[state='active']:bg-primary group-data-[state='active']:text-primary-foreground">
                      99
                    </div>
                  </Button>
                </TabsTrigger>
              </TabsList>
              <Button type="button" variant="ghost" size="icon">
                <BiCog className="text-lg" />
              </Button>
            </div>
            <TabsContent
              value={TabsMap.Inbox}
              className="max-h-[min(calc(100vh-12.5rem),20rem)] space-y-1 overflow-auto"
            >
              <NotificationItem
                sender={session.user}
                date={new Date()}
                theme="Test"
                title="Danil"
                isInbox={true}
              />
              <NotificationItem
                sender={session.user}
                date={new Date()}
                theme="Test"
                title="Danil"
                isInbox={false}
              />
              <NotificationItem
                sender={session.user}
                date={new Date()}
                theme="Test"
                title="Danil"
                isInbox={false}
              />
            </TabsContent>
            <TabsContent
              value={TabsMap.General}
              className="max-h-80 space-y-1 overflow-auto"
            >
              <p className="py-4 text-center">Ничего не найдено.</p>
            </TabsContent>
          </Tabs>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};
