import { ChatLayout } from "~/layouts/chat";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { type NextPageWithLayout } from "../_app";

const HomeChatPage: NextPageWithLayout = () => {
  return (
    <div className="grid place-items-center">
      <span className="rounded-full bg-muted-foreground/10 px-4 py-1">
        Выберите, с кем хотите начать диалог
      </span>
    </div>
  );
};

HomeChatPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>
      <ChatLayout>{page}</ChatLayout>
    </MainLayout>
  </ScaffoldLayout>
);

export default HomeChatPage;
