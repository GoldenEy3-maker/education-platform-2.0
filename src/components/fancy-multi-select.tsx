import { useCallback, useRef, useState } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Badge } from "./ui/badge";
import { BiX } from "react-icons/bi";
import { Command as CommandPrimitive } from "cmdk";
import { useControllableState } from "~/hooks/use-controllable-state";
import { cn } from "~/libs/utils";
import { Button } from "./ui/button";

type Option = {
  value: string;
  label: string;
};

type FancyMultiSelectProps = {
  id?: string;
  name?: string;
  value?: Option[];
  options: Option[];
  placeholder?: string;
  onValueChange?: (options: Option[]) => void;
  disabled?: boolean;
};

export const FancyMultiSelect: React.FC<FancyMultiSelectProps> = ({
  id,
  name,
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected = [], setSelected] = useControllableState<Option[]>({
    prop: value,
    defaultProp: [],
    onChange: onValueChange,
  });
  const [inputValue, setInputValue] = useState("");

  const handleUnselect = useCallback(
    (option: Option) => {
      setSelected((prev) => prev?.filter((o) => o.value !== option.value));
    },
    [setSelected],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              if (prev === undefined) return undefined;

              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [setSelected],
  );

  const selectables = options.filter(
    (option) => !selected.map((s) => s.value).includes(option.value),
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge
                key={option.value}
                variant="secondary"
                className={cn({
                  "pointer-events-none opacity-50": disabled,
                })}
              >
                {option.label}
                <button
                  type="button"
                  className="ml-1 rounded-full text-muted-foreground outline-none ring-offset-background hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                  disabled={disabled}
                >
                  <BiX />
                </button>
              </Badge>
            );
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 h-[1.625rem] flex-1 basis-28 bg-transparent outline-none placeholder:text-muted-foreground placeholder-shown:truncate disabled:cursor-not-allowed disabled:opacity-50"
            id={id}
            name={name}
            disabled={disabled}
          />
        </div>
      </div>
      <div className="relative z-20">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-2 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="custom-scrollbar max-h-60 overflow-auto">
                {selectables.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setInputValue("");
                        setSelected((prev) => {
                          if (prev === undefined) {
                            return [option];
                          }

                          return [...prev, option];
                        });
                      }}
                      className={"cursor-pointer"}
                      asChild
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-auto min-h-10 w-full justify-start whitespace-normal text-left"
                      >
                        {option.label}
                      </Button>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
};
