import { useEffect, useState } from "react";
import {
  BiCalendar,
  BiCog,
  BiMailSend,
  BiRocket,
  BiSearch,
  BiSmile,
  BiUser,
} from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";

type SearchCommandDialogProps = React.ComponentProps<"div">;

const useCtrlKeyKBind = (callback: () => void) => {
  useEffect(() => {
    const handleKeyBindEvent = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && event.ctrlKey) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyBindEvent);
    return () => document.removeEventListener("keydown", handleKeyBindEvent);
  }, [callback]);
};

export const SearchCommandDialog: React.FC<SearchCommandDialogProps> = ({
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useCtrlKeyKBind(() => setIsOpen(true));

  return (
    <div className={cn(className)} {...props}>
      <Button
        variant="outline"
        type="button"
        className="group w-full max-w-64 gap-3"
        onClick={() => setIsOpen(true)}
      >
        <BiSearch className="text-xl" />
        <p className="flex-grow text-left">Поиск</p>
        <span className="rounded-md border bg-secondary px-2 py-1 text-xs tracking-widest text-muted-foreground group-hover:bg-background">
          Ctrl K
        </span>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <BiCalendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <BiSmile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <BiRocket className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <BiUser className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <BiMailSend className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <BiCog className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};
