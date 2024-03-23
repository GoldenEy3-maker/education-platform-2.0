import { BiBell } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Avatar } from "./avatar";
import { SearchCommandDialog } from "./search-command-dialog";
import { Button } from "./ui/button";

export const Header: React.FC<React.ComponentProps<"header">> = ({
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        "container-grid sticky inset-y-0 top-0 z-10 border-b bg-background/95 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <SearchCommandDialog className="flex-grow" />
        <Button variant="ghost" type="button" size="icon">
          <BiBell className="text-xl" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="grid h-auto grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-3 py-1"
        >
          <Avatar
            className="row-span-2 h-10 w-10"
            fallback="U"
            src={undefined}
          />
          <p>Данил</p>
          <span className="text-xs text-muted-foreground">Студент</span>
        </Button>
      </div>
    </header>
  );
};
