import { useEffect, useState } from "react";
import {
  BiCalendar,
  BiCog,
  BiMailSend,
  BiRocket,
  BiSearch,
  BiSmile,
  BiUser,
} from "react-icons/bi";
import { useNavigatorUserAgent } from "~/hooks/user-navigator";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";
import {
  TbCalendarTime,
  TbHome,
  TbLock,
  TbMail,
  TbMessage,
  TbNotebook,
  TbSettings,
  TbUser,
} from "react-icons/tb";
import Link from "next/link";
import { PagePathMap } from "~/libs/enums";
import { useRouter } from "next/router";
import { api } from "~/libs/api";
import { Skeleton } from "./ui/skeleton";

type SearchCommandDialogProps = React.ComponentProps<"div">;

const useCtrlKeyKBind = (callback: () => void) => {
  useEffect(() => {
    const handleKeyBindEvent = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && event.ctrlKey) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyBindEvent);
    return () => document.removeEventListener("keydown", handleKeyBindEvent);
  }, [callback]);
};

export const SearchCommandDialog: React.FC<SearchCommandDialogProps> = ({
  className,
  ...props
}) => {
  const router = useRouter();
  const { isMac } = useNavigatorUserAgent();
  const [isOpen, setIsOpen] = useState(false);

  const getAllCoursesQuery = api.course.getAll.useQuery(undefined, {
    refetchOnMount: false,
  });

  useCtrlKeyKBind(() => setIsOpen(true));

  useEffect(() => {
    if (router.isReady) setIsOpen(false);
  }, [router]);

  return (
    <div className={cn(className)} {...props}>
      <Button
        variant="outline"
        type="button"
        className="group w-10 max-w-64 gap-3 max-xs:border-none max-xs:bg-transparent max-xs:shadow-none xs:w-full"
        onClick={() => setIsOpen(true)}
      >
        <BiSearch className="shrink-0 text-xl" />
        <p className="flex-grow text-left max-xs:hidden">Поиск</p>
        <span className="rounded-md border bg-secondary px-2 py-1 text-xs tracking-widest text-muted-foreground group-hover:bg-background max-xs:hidden">
          {isMac ? "Cmd" : "Ctrl"} K
        </span>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Что ищите..." />
        <CommandList>
          <CommandEmpty>Ничего не найдено.</CommandEmpty>
          <CommandGroup heading="Страницы">
            <CommandItem asChild>
              <Link href={PagePathMap.Home}>
                <TbHome className="mr-2 h-4 w-4" />
                <span>Главная</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={PagePathMap.Course}>
                <TbNotebook className="mr-2 h-4 w-4" />
                <span>Курсы</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={PagePathMap.Schedule}>
                <TbCalendarTime className="mr-2 h-4 w-4" />
                <span>Расписание</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={PagePathMap.Chat}>
                <TbMessage className="mr-2 h-4 w-4" />
                <span>Сообщения</span>
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          {!getAllCoursesQuery.isLoading ? (
            getAllCoursesQuery.data?.length ? (
              <CommandGroup heading="Курсы">
                {getAllCoursesQuery.data.map((course) => (
                  <CommandItem key={course.id} asChild>
                    <Link href={PagePathMap.Course + course.id}>
                      <span>{course.fullTitle}</span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null
          ) : (
            <CommandGroup heading="Курсы">
              <div className="space-y-1">
                <Skeleton className="h-11 rounded-sm" />
                <Skeleton className="h-11 rounded-sm" />
                <Skeleton className="h-11 rounded-sm" />
                <Skeleton className="h-11 rounded-sm" />
              </div>
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Настройки">
            <CommandItem asChild>
              <Link href={PagePathMap.Settings + "?tab=Profile"}>
                <TbUser className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={PagePathMap.Settings + "?tab=Password"}>
                <TbLock className="mr-2 h-4 w-4" />
                <span>Пароль</span>
              </Link>
            </CommandItem>
            <CommandItem asChild>
              <Link href={PagePathMap.Settings + "?tab=Email"}>
                <TbMail className="mr-2 h-4 w-4" />
                <span>Email</span>
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
