import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  BiBook,
  BiCalendar,
  BiCog,
  BiGroup,
  BiHelpCircle,
  BiHome,
  BiLogOutCircle,
  BiMenu,
  BiMoon,
} from "react-icons/bi";
import { PagePathMap, TranslateRoleMap } from "~/libs/enums";
import { getFirstLettersUserCredentials } from "~/libs/utils";
import { Avatar } from "./avatar";
import { SignOutAlertDrawer } from "./sign-out-alert-drawer";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

export const SidebarDrawer: React.FC<React.PropsWithChildren> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    if (router.isReady) setIsOpen(false);
  }, [router]);

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="icon" variant="ghost" type="button" className="md:hidden">
          <BiMenu className="text-xl" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        className="inset-y-0 left-0 mt-0 grid max-h-svh grid-rows-[auto_auto_1fr] p-4"
        isNotchDisabled
      >
        <header className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-4">
          {session?.user ? (
            <>
              <Avatar
                fallback={getFirstLettersUserCredentials(
                  session.user.surname,
                  session.user.name,
                )}
                src={session.user.image}
                className="row-span-2 h-14 w-14"
              />
              <p>
                {session.user.surname} {session.user.name}{" "}
                {session.user.fathername}
              </p>
              <span className="text-muted-foreground">
                {TranslateRoleMap[session.user.role]}
              </span>
            </>
          ) : (
            <>
              <Skeleton className="row-span-2 h-14 w-14 rounded-full" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-28" />
            </>
          )}
        </header>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-2 overflow-auto">
          <Button
            asChild
            className="w-full shrink-0 justify-normal gap-2"
            variant="ghost"
          >
            <Link href={PagePathMap.Home}>
              <BiHome className="text-xl" /> <span>Главная</span>
            </Link>
          </Button>
          <Button
            asChild
            className="w-full shrink-0 justify-normal gap-2"
            variant="ghost"
          >
            <Link href={PagePathMap.Courses}>
              <BiBook className="text-xl" /> <span>Курсы</span>
            </Link>
          </Button>
          <Button
            asChild
            className="w-full shrink-0 justify-normal gap-2"
            variant="ghost"
          >
            <Link href={PagePathMap.Home}>
              <BiCalendar className="text-xl" /> <span>Расписание</span>
            </Link>
          </Button>
          <Button
            asChild
            className="w-full shrink-0 justify-normal gap-2"
            variant="ghost"
          >
            <Link href={PagePathMap.Home}>
              <BiGroup className="text-xl" /> <span>Пользователи</span>
            </Link>
          </Button>
          <div className="relative mt-auto rounded-lg p-4">
            <div className="mb-2 flex items-center gap-2">
              <BiHelpCircle className="text-xl" /> <span>Нужна помощь?</span>
            </div>
            <p className="text-sm">
              <Link href={"#"} className="text-primary">
                Свяжитесь
              </Link>{" "}
              с нашими экспертами или{" "}
              <Link href="#" className="text-primary">
                посмотрите обучающий видеоролик
              </Link>
              .
            </p>
          </div>
          <div className="space-y-1">
            <span className="mb-1 block text-muted-foreground">Общее</span>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-between gap-2"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <div>
                <Label
                  htmlFor="dark-theme"
                  className="pointer-events-none flex items-center gap-2"
                >
                  <BiMoon className="text-xl" />
                  <span>Темная тема</span>
                </Label>
                <Switch id="dark-theme" checked={resolvedTheme === "dark"} />
              </div>
            </Button>
            <Button
              asChild
              className="w-full shrink-0 justify-normal gap-2"
              variant="ghost"
            >
              <Link href={PagePathMap.Home}>
                <BiCog className="text-xl" /> <span>Настройки</span>
              </Link>
            </Button>
            <SignOutAlertDrawer>
              <Button
                className="w-full shrink-0 justify-normal gap-2"
                variant="ghost"
              >
                <BiLogOutCircle className="text-xl" /> <span>Выход</span>
              </Button>
            </SignOutAlertDrawer>
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};
