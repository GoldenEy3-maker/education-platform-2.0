import dayjs from "dayjs";
import Link from "next/link";
import { useState } from "react";
import {
  BiDotsVerticalRounded,
  BiLeftArrowAlt,
  BiPaperclip,
  BiSearch,
  BiSolidSend,
} from "react-icons/bi";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ChatLayout } from "~/layouts/chat";
import { MainLayout } from "~/layouts/main";
import { ScaffoldLayout } from "~/layouts/scaffold";
import { PagePathMap } from "~/libs/enums";
import { type NextPageWithLayout } from "../_app";

const ChatPage: NextPageWithLayout = () => {
  const [messageValue, setMessageValue] = useState("");

  return (
    <div className="grid grid-rows-[auto_1fr_auto]">
      <header className="grid grid-cols-[auto_1fr_repeat(2,minmax(0,auto))] gap-2 border-b px-4 py-2">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href={PagePathMap.HomeChat}>
            <BiLeftArrowAlt className="text-xl" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <p className="font-medium">Королев Данил</p>
          <span className="text-sm text-primary">Онлайн</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <BiSearch className="text-xl" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <BiDotsVerticalRounded className="text-xl" />
          </Button>
        </div>
      </header>
      <div className="custom-scrollbar mt-auto flex max-h-[calc(100vh-13rem)] flex-col gap-2 overflow-auto p-4">
        <div className="sticky top-0 flex items-center justify-center">
          <span className="rounded-full bg-muted/40 px-4 py-1 text-sm capitalize">
            {dayjs(new Date()).format("MMMM DD")}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-end">
            <div className="flex max-w-[80%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
              <p>Привет! Как дела?</p>
              <time
                dateTime={new Date().toISOString()}
                className="text-sm text-muted"
              >
                {dayjs(new Date()).format("HH:mm")}
              </time>
            </div>
          </div>
        </div>
      </div>
      <footer className="grid grid-cols-[auto_1fr_auto] gap-2 border-t px-4 py-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <BiPaperclip className="text-xl" />
        </Button>
        <Textarea
          className="hidden-scrollbar flex h-9 max-h-40 min-h-full resize-none items-center justify-center border-none py-2 shadow-none"
          name="text"
          placeholder="Написать сообщение..."
          value={messageValue}
          onChange={(event) => {
            setMessageValue(event.target.value);

            event.currentTarget.style.height = "2.25rem";
            event.currentTarget.style.height =
              event.currentTarget.scrollHeight + "px";
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full text-primary hover:text-primary"
        >
          <BiSolidSend className="text-xl" />
        </Button>
      </footer>
    </div>
  );
};

ChatPage.getLayout = (page) => (
  <ScaffoldLayout>
    <MainLayout>
      <ChatLayout>{page}</ChatLayout>
    </MainLayout>
  </ScaffoldLayout>
);

export default ChatPage;
