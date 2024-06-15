import Link from "next/link";
import {
  BiChevronRight,
  BiSolidBell,
  BiSolidEnvelope,
  BiSolidLockAlt,
  BiSolidUser,
} from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { ChangePassword } from "~/components/settings/change-password";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";
import { parseAsStringEnum, useQueryState } from "nuqs";

const TabsMap = {
  Profile: "Profile",
  Password: "Password",
  Email: "Email",
  Notifications: "Notifications",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { icon: React.ReactNode; text: string }> =
  {
    Profile: {
      icon: (
        <BiSolidUser className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Профиль",
    },
    Password: {
      icon: (
        <BiSolidLockAlt className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Пароль",
    },
    Email: {
      icon: (
        <BiSolidEnvelope className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Email",
    },
    Notifications: {
      icon: (
        <BiSolidBell className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Уведомления",
    },
  };

const SettingsPage: NextPageWithLayout = () => {
  const [tabs, setTabs] = useQueryState(
    "tab",
    parseAsStringEnum<TabsMap>(Object.values(TabsMap)).withDefault("Password"),
  );

  return (
    <main>
      <div className="h-56 w-full rounded-3xl bg-muted/30"></div>
      <div className="-translate-y-4 sm:px-8 min-[968px]:-translate-y-9">
        <div className="flex flex-wrap items-center gap-x-6">
          <Avatar
            className="h-36 w-36 shrink-0 rounded-full border-[3px] border-background text-3xl"
            fallback="КД"
          />
          <div className="mt-3 flex-1">
            <header className="flex items-center justify-between gap-2">
              <h1 className="text-3xl font-medium">Настройки</h1>
              <Button
                asChild
                variant="link"
                className="gap-1 max-[968px]:hidden"
              >
                <Link href={PagePathMap.Profile + "1"}>
                  <span>Посмотреть профиль</span>
                  <BiChevronRight className="text-xl" />
                </Link>
              </Button>
            </header>
            <span className="block text-muted-foreground">
              danil-danil-korolev@bk.ru
            </span>
            <Button asChild variant="link" className="gap-1 min-[968px]:hidden">
              <Link href={PagePathMap.Profile + "1"}>
                <span>Посмотреть профиль</span>
                <BiChevronRight className="text-xl" />
              </Link>
            </Button>
          </div>
        </div>
        <Tabs
          value={tabs}
          onValueChange={(value) => setTabs(value as TabsMap)}
          className="mt-3"
        >
          <TabsList className="hidden-scrollbar mb-6 flex h-auto max-w-full justify-normal overflow-auto rounded-none border-b bg-transparent p-0">
            {Object.entries(TabsTriggerMap).map(([key, value]) => (
              <TabsTrigger
                value={key}
                asChild
                key={key}
                className="group h-auto shrink-0 gap-2 rounded-none border-b border-primary/0 py-3 data-[state='active']:border-primary data-[state='active']:!bg-background/0 data-[state='active']:!shadow-none data-[state='active']:hover:!bg-accent"
              >
                <Button variant="ghost" type="button">
                  {value.icon}
                  <span>{value.text}</span>
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={TabsMap.Password}>
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

SettingsPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default SettingsPage;
