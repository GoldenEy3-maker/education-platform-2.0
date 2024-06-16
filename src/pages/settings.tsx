import Link from "next/link";
import { Avatar } from "~/components/avatar";
import { ChangePasswordTab } from "~/components/settings/change-password-tab";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { getFirstLettersUserCredentials, type ValueOf } from "~/libs/utils";
import { type NextPageWithLayout } from "./_app";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { TbBell, TbChevronRight, TbLock, TbMail, TbUser } from "react-icons/tb";
import { ProfileTab } from "~/components/settings/profile-tab";
import { useFileReader } from "~/hooks/use-fille-reader";
import Image from "next/image";
import { Skeleton } from "~/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { EmailTab } from "~/components/settings/email-tab";

const TabsMap = {
  Profile: "Profile",
  Password: "Password",
  Email: "Email",
} as const;

type TabsMap = ValueOf<typeof TabsMap>;

const TabsTriggerMap: Record<TabsMap, { icon: React.ReactNode; text: string }> =
  {
    Profile: {
      icon: (
        <TbUser className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Профиль",
    },
    Password: {
      icon: (
        <TbLock className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Пароль",
    },
    Email: {
      icon: (
        <TbMail className="shrink-0 text-xl group-data-[state=active]:text-primary" />
      ),
      text: "Email",
    },
  };

const SettingsPage: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const bgFileReader = useFileReader();
  const avatarFileReader = useFileReader();

  const [tabs, setTabs] = useQueryState(
    "tab",
    parseAsStringEnum<TabsMap>(Object.values(TabsMap)).withDefault("Profile"),
  );

  return (
    <main className="container-grid">
      <div className="full-width relative !block h-40 w-full sm:h-56">
        {bgFileReader.previews?.[0] ? (
          <Image
            src={bgFileReader.previews[0].base64}
            alt="Фоновое изображение"
            priority
            fill
            className="object-cover"
          />
        ) : session?.user.bgImage ? (
          <Image
            src={session.user.bgImage}
            alt="Фоновое изображение"
            priority
            fill
            className="object-cover"
          />
        ) : null}
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      <div className="relative z-20 border-border py-4 sm:-mt-12 sm:rounded-xl sm:border sm:bg-background sm:px-8">
        <div className="flex flex-wrap items-center gap-x-6">
          <Avatar
            className="h-32 w-32 shrink-0 rounded-full border-[3px] border-background text-2xl"
            fallback={getFirstLettersUserCredentials(
              session?.user.surname ?? "",
              session?.user.name ?? "",
            )}
            src={avatarFileReader.previews?.[0]?.base64 ?? session?.user.image}
          />
          <div className="mt-3 flex-1">
            <header className="flex items-center justify-between gap-2">
              <h1 className="text-3xl font-medium">Настройки</h1>
              <Button
                asChild
                variant="link"
                className="gap-1 max-[968px]:hidden"
              >
                <Link href={PagePathMap.Profile + session?.user.id}>
                  <span>Посмотреть профиль</span>
                  <TbChevronRight className="text-lg" />
                </Link>
              </Button>
            </header>
            <span className="block text-muted-foreground">
              {session?.user.surname} {session?.user.name}{" "}
              {session?.user.fathername}
            </span>
            <Button asChild variant="link" className="gap-1 min-[969px]:hidden">
              <Link href={PagePathMap.Profile + "1"}>
                <span>Посмотреть профиль</span>
                <TbChevronRight className="text-lg" />
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
          <TabsContent value={TabsMap.Profile}>
            <ProfileTab
              onBgSelect={(files) => {
                if (files) void bgFileReader.readFiles(files);
              }}
              onAvatarSelect={(files) => {
                if (files) void avatarFileReader.readFiles(files);
              }}
              onCancel={() => {
                bgFileReader.reset();
                avatarFileReader.reset();
              }}
            />
          </TabsContent>
          <TabsContent value={TabsMap.Password}>
            <ChangePasswordTab />
          </TabsContent>
          <TabsContent value={TabsMap.Email}>
            <EmailTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

SettingsPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout isContainerOff>{page}</MainLayout>
  </ScaffoldLayout>
);

export default SettingsPage;
