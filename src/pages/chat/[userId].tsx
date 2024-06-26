import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    <div className="flex h-[inherit] flex-col justify-between">
      <header className="grid grid-cols-[auto_1fr_repeat(2,minmax(0,auto))] gap-2 border-b pb-2 min-[1120px]:px-4 min-[1120px]:py-2">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link href={PagePathMap.HomeChat}>
            <BiLeftArrowAlt className="text-xl" />
          </Link>
        </Button>
        <div className="flex flex-col overflow-hidden">
          <p className="truncate font-medium">Королев Данил</p>
          <span className="truncate text-sm text-primary">Онлайн</span>
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
      <div className="mt-auto flex h-full flex-col overflow-auto ">
        <div className="custom-scrollbar flex flex-col gap-2 overflow-auto py-4 min-[1120px]:p-4">
          <div className="flex flex-col gap-2">
            <div className="sticky top-0 flex items-center justify-center">
              <span className="rounded-full bg-muted/90 px-4 py-1 text-sm capitalize">
                {dayjs().format("MMMM DD")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>Привет! Как дела?</p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-muted/60 px-3 py-2 text-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted-foreground"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-muted/60 px-3 py-2 text-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted-foreground"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-muted/60 px-3 py-2 text-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted-foreground"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex max-w-[70%] items-end gap-2 whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-primary-foreground">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Consectetur dignissimos aut ea sit minus mollitia esse
                    quibusdam obcaecati repudiandae optio, eius et deserunt
                    sapiente a omnis nam quod facere ullam.
                  </p>
                  <time
                    dateTime={dayjs().toISOString()}
                    className="text-sm text-muted"
                  >
                    {dayjs().format("HH:mm")}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="grid grid-cols-[auto_1fr_auto] gap-2 border-t pb-1 pt-2 min-[1120px]:px-4">
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
