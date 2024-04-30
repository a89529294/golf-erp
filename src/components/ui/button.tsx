import backIcon from "@/assets/back.svg";
import leaveIcon from "@/assets/leave-icon.svg";
import magnifyingGlassIcon from "@/assets/magnifying-glass-icon.svg";
import pfpIcon from "@/assets/pfp-icon.svg";
import plusIcon from "@/assets/plus-icon.svg";
import saveIcon from "@/assets/save.svg";
import circleIcon from "@/assets/circle.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { ComponentProps, ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils";

const iconMap = {
  leave: leaveIcon,
  plus: plusIcon,
  magnifyingGlass: magnifyingGlassIcon,
  pfp: pfpIcon,
  save: saveIcon,
  back: backIcon,
  trashCan: trashCanIcon,
};

const button = tv({
  base: "flex h-11 items-center gap-1 bg-light-gray px-3 outline outline-1 outline-line-gray hover:outline-[1.5px] hover:outline-orange focus-visible:outline-[1.5px] focus-visible:outline-orange disabled:opacity-50 disabled:hover:outline-1 disabled:hover:outline-line-gray",
  variants: {
    borderLess: {
      true: "px-5 outline-0 hover:outline-0 focus-visible:outline-0",
    },
    color: {
      warning:
        "bg-btn-red outline-line-red hover:outline-line-red-hover text-word-red",
    },
    iconLess: {
      true: "",
    },
    size: {
      wide: "px-8",
    },
  },
});

type IconButtonType = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon: keyof typeof iconMap;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonType>(
  ({ children, icon, onClick, ...props }, ref) => {
    return (
      <button ref={ref} className={button()} onClick={onClick} {...props}>
        <img src={iconMap[icon]} />
        {children}
      </button>
    );
  },
);

export const IconWarningButton = forwardRef<HTMLButtonElement, IconButtonType>(
  ({ children, icon, onClick, ...props }, ref) => {
    return (
      <button
        className={button({ color: "warning" })}
        onClick={onClick}
        {...props}
        ref={ref}
      >
        <img src={iconMap[icon]} />
        {children}
      </button>
    );
  },
);

export const IconButtonBorderLess = ({
  children,
  icon,
  onClick,
}: {
  children?: ReactNode;
  icon: keyof typeof iconMap;
  onClick?: () => void;
}) => {
  return (
    <button
      className={twMerge(button({ borderLess: true, class: "h-full" }))}
      onClick={onClick}
    >
      <img src={iconMap[icon]} />
      {children}
    </button>
  );
};

export const TextButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { loading?: boolean; disabled?: boolean }
>(({ children, className, onClick, loading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(button({ iconLess: true, size: "wide" }), className)}
      onClick={onClick}
      {...props}
    >
      {loading && <img src={circleIcon} className=" h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
});

export const TextWarningButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { disabled?: boolean }
>(({ children, onClick, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        button({ iconLess: true, size: "wide", color: "warning" }),
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});
