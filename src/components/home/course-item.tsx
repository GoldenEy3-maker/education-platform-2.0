import Link from "next/link"
import { cn, getPersonInitials } from "~/libs/utils"
import { Avatar } from "../avatar"
import { CircularProgress } from "../circular-progress"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

type CourseItemProps = {
  id: string;
  title: string;
  thumbnail?: string;
  author: { surname: string; name: string; fathername?: string };
  progress?: number;
  className?: string;
};

export const CourseItem: React.FC<CourseItemProps> = (props) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "grid h-auto w-full grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3",
        props.className,
      )}
    >
      <Link href="#">
        <Avatar
          fallback={props.title.at(0)}
          src={props.thumbnail}
          className="row-span-2"
        />
        <p className="truncate text-base">{props.title}</p>
        <div className="col-start-2 row-start-2 flex items-center gap-2 overflow-hidden">
          <span className="truncate text-muted-foreground">
            {getPersonInitials(
              props.author.surname,
              props.author.name,
              props.author.fathername,
            )}
          </span>
          {props.progress ? (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <CircularProgress
                    value={props.progress}
                    strokeWidth={7}
                    className="text-xl text-primary"
                  />
                </TooltipTrigger>
                <TooltipContent>{props.progress}%</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null}
        </div>
      </Link>
    </Button>
  );
};

export const CourseItemSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 px-4 py-2">
      <Skeleton className="row-span-2 h-12 w-12 rounded-full" />
      <Skeleton className="h-3 w-40 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
};
