import { useEffect } from "react";
import { BiBell, BiSearch } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";

export const Header: React.FC<React.ComponentProps<"header">> = ({
  className,
  ...props
}) => {
  useEffect(() => {
    const handleKeyBindEvent = (event: KeyboardEvent) => {
      if (event.code === "KeyK" && event.ctrlKey) {
        event.preventDefault();
        console.log("search");
      }
    };

    document.addEventListener("keydown", handleKeyBindEvent);
    return () => document.removeEventListener("keydown", handleKeyBindEvent);
  }, []);

  return (
    <header
      className={cn(
        "container-grid sticky inset-y-0 top-0 z-10 border-b bg-background/95 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex w-full max-w-56 items-center gap-3 rounded-lg border bg-background/70 px-3 py-2"
        >
          <BiSearch className="text-xl" />
          <p className="flex-grow text-left">Поиск</p>
          <span className="rounded-md border bg-secondary px-2 py-1 text-xs tracking-widest text-muted-foreground">
            Ctrl K
          </span>
        </button>
        <Button variant="ghost" size="icon">
          <BiBell className="text-xl" />
        </Button>
      </div>
    </header>
  );
};
