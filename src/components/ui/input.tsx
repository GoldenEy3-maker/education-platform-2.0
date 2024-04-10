import * as React from "react";

import { BiHide, BiShow } from "react-icons/bi";
import { cn } from "~/libs/utils";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onClickTrailingIcon?: React.MouseEventHandler<HTMLButtonElement>;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      disabled,
      value,
      leadingIcon,
      trailingIcon,
      onClickTrailingIcon,
      ...props
    },
    ref,
  ) => {
    const [isRevealPassword, setIsRevealPassword] = React.useState(false);

    const isPasswordType = type === "password";

    return (
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 ml-4 flex items-center justify-center">
            {leadingIcon}
          </span>
        ) : null}
        <input
          type={isPasswordType && isRevealPassword ? "text" : type}
          disabled={disabled}
          value={value}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder-shown:truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            {
              "pr-12": (isPasswordType && value !== "") || trailingIcon,
              "pl-11": leadingIcon,
            },
            className,
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && value !== "" ? (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 my-auto mr-2"
                  onClick={() => setIsRevealPassword((prev) => !prev)}
                  // title={isRevealPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {isRevealPassword ? (
                    <BiHide className="text-lg" />
                  ) : (
                    <BiShow className="text-lg" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isRevealPassword ? "Скрыть пароль" : "Показать пароль"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : trailingIcon ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute inset-y-0 right-0 my-auto mr-2"
            onClick={onClickTrailingIcon}
          >
            {trailingIcon}
          </Button>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
