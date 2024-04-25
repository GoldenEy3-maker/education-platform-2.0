import { type Prisma } from "@prisma/client";
import Link from "next/link";
import {
  BiBookmarkMinus,
  BiDotsVerticalRounded,
  BiMessageAlt,
  BiRightArrowAlt,
} from "react-icons/bi";
import { Avatar } from "../avatar";
import { CircularProgress } from "../circular-progress";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

type SubscriberItemProps = {
  isAuthor: boolean;
  id: string;
  progress: number;
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      fathername: true;
      name: true;
      surname: true;
      image: true;
      group: true;
      email: true;
    };
  }>;
};

export const SubscriberItem: React.FC<SubscriberItemProps> = ({
  id,
  isAuthor,
  progress,
  user,
}) => {
  return (
    <div className="relative rounded-md border bg-background p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-full data-[state=open]:bg-accent"
          >
            <BiDotsVerticalRounded className="text-xl" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Button variant="ghost" className="w-full justify-start">
              <BiMessageAlt className="mr-2 text-xl" />
              <span>Перейти в чат</span>
            </Button>
          </DropdownMenuItem>
          {isAuthor ? (
            <DropdownMenuItem asChild>
              <Button
                variant="ghost-destructive"
                className="w-full justify-start hover:!bg-destructive/15 hover:!text-destructive focus-visible:!bg-destructive/15 focus-visible:!text-destructive"
              >
                <BiBookmarkMinus className="mr-2 text-xl" />
                <span>Отписать</span>
              </Button>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex flex-col items-center ">
        <Avatar fallback="КД" className="h-16 w-16" />
        <p className="font-medium">
          {user.surname} {user.name}
        </p>
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>
      <div className="my-4 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <p className="font-medium">3</p>
          <span className="text-sm text-muted-foreground">Завершено</span>
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress
            className="text-2xl text-primary"
            strokeWidth={8}
            value={progress}
          />
          <span className="text-sm text-muted-foreground">
            Прогресс ({progress}%)
          </span>
        </div>
      </div>
      <footer className="mt-2 flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {user.group?.name}
        </span>
        <Button variant="link" asChild className="gap-2">
          <Link href="#">
            <span>Профиль</span>
            <BiRightArrowAlt className="text-xl" />
          </Link>
        </Button>
      </footer>
    </div>
  );
};

export const SubscriberItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-md border bg-background p-4">
      <div className="flex flex-col items-center">
        <Skeleton className="mb-1 h-16 w-16 rounded-full" />
        <Skeleton className="mb-1 h-5 w-28 rounded-full" />
        <Skeleton className="h-4 w-44 rounded-full" />
      </div>
      <div className="my-4 flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <Skeleton className="mb-1 h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress
            className="text-2xl text-primary"
            strokeWidth={8}
            value={0}
          />
          <Skeleton className="mt-1 h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
};
