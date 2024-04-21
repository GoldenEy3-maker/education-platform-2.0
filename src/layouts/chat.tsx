import dayjs from "dayjs";
import Link from "next/link";
import { BiSearch, BiUserPlus } from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PagePathMap } from "~/libs/enums";

export const ChatLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <main className="grid grid-cols-[20rem_1fr]">
      <aside className="border-r p-4">
        <header className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-medium">Сообщения</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <BiUserPlus className="text-xl" />
          </Button>
        </header>
        <Input
          placeholder="Поиск сообщений..."
          leadingIcon={<BiSearch className="text-xl" />}
          className="my-3"
        />
        <div className="custom-scrollbar max-h-[calc(100vh-14.5rem)] space-y-1 overflow-auto">
          <Button
            asChild
            variant="ghost"
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
          >
            <Link href={PagePathMap.Chat + "1"}>
              <Avatar fallback="КД" className="row-span-2" isOnline />
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-base font-medium">
                  Королев Данил
                </p>
                <time
                  dateTime={new Date().toISOString()}
                  className="text-muted-foreground"
                >
                  {dayjs(new Date()).format("HH:mm")}
                </time>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-muted-foreground">
                  Привет! Как дела?
                </p>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  5
                </span>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
          >
            <Link href={PagePathMap.Chat + "1"}>
              <Avatar fallback="КД" className="row-span-2" />
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-base font-medium">
                  Королев Данил
                </p>
                <time
                  dateTime={new Date().toISOString()}
                  className="text-muted-foreground"
                >
                  {dayjs(new Date()).format("HH:mm")}
                </time>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-muted-foreground">
                  Привет! Как дела?
                </p>
                {/* <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  1
                </span> */}
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
          >
            <Link href={PagePathMap.Chat + "1"}>
              <Avatar fallback="КД" className="row-span-2" isOnline />
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-base font-medium">
                  Королев Данил
                </p>
                <time
                  dateTime={new Date().toISOString()}
                  className="text-muted-foreground"
                >
                  {dayjs(new Date()).format("HH:mm")}
                </time>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-muted-foreground">
                  Привет! Как дела?
                </p>
                {/* <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  1
                </span> */}
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
          >
            <Link href={PagePathMap.Chat + "1"}>
              <Avatar fallback="КД" className="row-span-2" isOnline />
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-base font-medium">
                  Королев Данил
                </p>
                <time
                  dateTime={new Date().toISOString()}
                  className="text-muted-foreground"
                >
                  {dayjs(new Date()).format("HH:mm")}
                </time>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-muted-foreground">
                  Привет! Как дела?
                </p>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  2
                </span>
              </div>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3"
          >
            <Link href={PagePathMap.Chat + "1"}>
              <Avatar fallback="КД" className="row-span-2" />
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-base font-medium">
                  Королев Данил
                </p>
                <time
                  dateTime={new Date().toISOString()}
                  className="text-muted-foreground"
                >
                  {dayjs(new Date()).format("HH:mm")}
                </time>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <p className="grow truncate text-muted-foreground">
                  Привет! Как дела?
                </p>
                {/* <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                  1
                </span> */}
              </div>
            </Link>
          </Button>
        </div>
      </aside>
      {children}
    </main>
  );
};
