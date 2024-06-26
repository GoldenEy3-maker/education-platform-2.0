import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { useRippleEffect } from "~/hooks/use-ripple-effect";

import { cn } from "~/libs/utils";

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "[--ripple-clr:theme('colors.primary.foreground')] bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "[--ripple-clr:theme('colors.background')] bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        "outline-destructive":
          "text-destructive border border-destructive/20 shadow-sm hover:border-destructive/15 hover:bg-destructive/15 [--ripple-clr:theme('colors.destructive.DEFAULT')] focus-visible:ring-destructive",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/15 [--ripple-clr:theme('colors.destructive.DEFAULT')] focus-visible:ring-destructive",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, onPointerDown, ...props },
    ref,
  ) => {
    const rippleEffectEvent = useRippleEffect();

    const Comp = asChild ? Slot : "button";

    const pointerDownHandler: React.PointerEventHandler<HTMLButtonElement> = (
      event,
    ) => {
      rippleEffectEvent(event);

      if (onPointerDown) onPointerDown(event);
    };

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onPointerDown={pointerDownHandler}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
