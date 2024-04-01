import { useSession } from "next-auth/react";
import { TranslateRoleMap } from "~/libs/enums";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { NotificationPopover } from "./notification-popover";
import { SearchCommandDialog } from "./search-command-dialog";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export const Header: React.FC<React.ComponentProps<"header">> = ({
  className,
  ...props
}) => {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "container-grid sticky inset-y-0 top-0 z-50 border-b bg-background/95 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <SearchCommandDialog className="flex-grow" />
        {session?.user ? (
          <>
            <NotificationPopover />
            <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] justify-normal gap-x-3 px-4 py-1 text-left text-sm">
              <Avatar
                className="row-span-2 h-10 w-10"
                fallback={session.user.name?.at(0)}
                src={session.user.image}
              />
              <p className="max-sm:hidden">
                {session.user.surname} {session.user.name}
              </p>
              <span className="text-xs text-muted-foreground max-sm:hidden">
                {TranslateRoleMap[session.user.role]}
              </span>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-3 px-4 py-1">
            <Skeleton className="row-span-2 h-10 w-10 rounded-full" />
            <Skeleton className="h-3 w-32 rounded-lg" />
            <Skeleton className="h-3 w-20 rounded-lg" />
          </div>
        )}
      </div>
    </header>
  );
};
