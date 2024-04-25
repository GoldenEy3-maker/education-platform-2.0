import { cva } from "class-variance-authority";
import dayjs from "dayjs";
import Link from "next/link";
import {
  BiSolidCheckCircle,
  BiSolidTimeFive,
  BiSolidXCircle,
} from "react-icons/bi";
import { type IconType } from "react-icons/lib";
import { cn, type ValueOf } from "~/libs/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const DeadlineItemVariantMap = {
  Warning: "Warning",
  Destructive: "Destructive",
  Useful: "Useful",
} as const;

type DeadlineItemVariantMap = ValueOf<typeof DeadlineItemVariantMap>;

type DeadlineItemProps = {
  title: string;
  date: Date;
  course: string;
  isCompleted?: boolean;
};

const deadlineItemIconVariants = cva<{
  variant: Record<DeadlineItemVariantMap, string>;
}>("row-span-2 text-xl", {
  variants: {
    variant: {
      Warning: "text-warning",
      Destructive: "text-destructive",
      Useful: "text-useful",
    },
  },
});

const DeadlineItemIconMap: Record<DeadlineItemVariantMap, IconType> = {
  Warning: BiSolidTimeFive,
  Destructive: BiSolidXCircle,
  Useful: BiSolidCheckCircle,
};

const DeadlineItemBadgeMap: Record<DeadlineItemVariantMap, string> = {
  Warning: "В процессе",
  Useful: "Выполнено",
  Destructive: "Просрочено",
};

const deadlineItemBadgeVariants = cva<{
  variant: Record<DeadlineItemVariantMap, string>;
}>("rounded-full", {
  variants: {
    variant: {
      Warning: "bg-warning/30 text-warning-foreground hover:bg-warning/60",
      Useful: "bg-useful/30 text-useful-foreground hover:bg-useful/60",
      Destructive:
        "bg-destructive/30 text-destructive-foreground-variant hover:bg-destructive/60",
    },
  },
});

export const DeadlineItem: React.FC<DeadlineItemProps> = ({
  title,
  date,
  course,
  isCompleted,
}) => {
  const dateDiff = dayjs(date).diff();
  const variant: DeadlineItemVariantMap = isCompleted
    ? "Useful"
    : dateDiff > 0
      ? "Warning"
      : "Destructive";

  const Icon = DeadlineItemIconMap[variant];

  return (
    <Button
      asChild
      variant="ghost"
      className="grid h-auto w-full grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] justify-normal gap-x-3 text-left"
    >
      <Link href="#">
        <Icon className={cn(deadlineItemIconVariants({ variant }))} />
        <p className="truncate text-base">
          {`${title}${variant === "Warning" ? " (" + dayjs(date).fromNow(true) + ")" : ""}`}
        </p>
        <span className="col-start-2 row-start-2 truncate text-muted-foreground">
          {course}
        </span>
        <div className="row-span-2 hidden items-center justify-center xs:flex">
          <Badge className={cn(deadlineItemBadgeVariants({ variant }))}>
            {DeadlineItemBadgeMap[variant]}
          </Badge>
        </div>
      </Link>
    </Button>
  );
};

export const DeadlineItemSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 gap-y-2 px-4 py-2">
      <Skeleton className="row-span-2 h-11 w-11 rounded-full" />
      <Skeleton className="h-3 w-40 rounded-full" />
      <Skeleton className="h-3 w-20 rounded-full" />
    </div>
  );
};
