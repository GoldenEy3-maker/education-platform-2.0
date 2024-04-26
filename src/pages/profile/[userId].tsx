import Link from "next/link";
import { BiEnvelope, BiShareAlt } from "react-icons/bi";
import { Avatar } from "~/components/avatar";
import { ShareDialogDrawer } from "~/components/share-dialog-drawer";
import { Button } from "~/components/ui/button";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
  return (
    <main>
      <div className="h-56 w-full rounded-3xl bg-[#A9C9FF] bg-[linear-gradient(180deg,#A9C9FF_0%,#FFBBEC_100%)] dark:bg-[#FF3CAC] dark:bg-[linear-gradient(225deg,#FF3CAC_0%,#784BA0_50%,#2B86C5_100%)]"></div>
      <div className="-translate-y-24 space-y-1 px-8">
        <Avatar className="h-36 w-36 text-2xl" fallback="КД" />
        <h1 className="text-3xl font-medium">Королев Данил Николаевич</h1>
        <p className="text-lg">К.105с11-5</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-muted-foreground">danil-danil-korolev@bk.ru</p>
          <div className="flex items-center gap-4">
            <ShareDialogDrawer>
              <Button variant="outline" className="gap-2">
                <BiShareAlt className="text-xl" />
                <span>Поделиться</span>
              </Button>
            </ShareDialogDrawer>
            <Button asChild className="gap-2">
              <Link href={PagePathMap.Chat + "1"}>
                <BiEnvelope className="text-xl" />
                <span>Написать</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

ProfilePage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>{page}</MainLayout>
  </ScaffoldLayout>
);

export default ProfilePage;
