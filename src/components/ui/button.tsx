import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans text-[15px] leading-none no-underline transition-[filter,transform] duration-150 hover:-translate-y-px hover:brightness-110 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-[13px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-gradient text-white",
        dark: "bg-dark text-white",
        white: "bg-white text-chip-ink",
        outline: "border border-primary bg-white text-primary",
      },
      size: {
        default: "h-[41px] px-[22px]",
        lg: "h-[50px] px-7 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
