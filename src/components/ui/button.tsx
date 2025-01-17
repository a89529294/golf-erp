import backIcon from "@/assets/back.svg";
import leaveIcon from "@/assets/leave-icon.svg";
import lockIcon from "@/assets/lock.svg";
import magnifyingGlassIcon from "@/assets/magnifying-glass-icon.svg";
import pfpIcon from "@/assets/pfp-icon.svg";
import plusIcon from "@/assets/plus-icon.svg";
import saveIcon from "@/assets/save.svg";
import minusIcon from "@/assets/minus-icon.svg";
import circleIcon from "@/assets/circle.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import pencilIcon from "@/assets/pencil.svg";
import resetIcon from "@/assets/reset.svg";
import keyIcon from "@/assets/key-icon.svg";
import xIcon from "@/assets/x.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import checkIcon from "@/assets/check.svg";
import couponIcon from "@/assets/coupon.svg";
import sendIcon from "@/assets/send-icon.svg";
import { ComponentProps, ReactNode, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { cn } from "@/lib/utils";
import { button } from "@/components/ui/button-cn";

const iconMap = {
  leave: leaveIcon,
  plus: plusIcon,
  magnifyingGlass: magnifyingGlassIcon,
  pfp: pfpIcon,
  save: saveIcon,
  back: backIcon,
  trashCan: trashCanIcon,
  minus: minusIcon,
  pencil: pencilIcon,
  x: xIcon,
  redX: redXIcon,
  check: checkIcon,
  coupon: couponIcon,
  lock: lockIcon,
  reset: resetIcon,
  send: sendIcon,
  key: keyIcon,
};

type IconButtonType = ComponentProps<"button"> & {
  icon: keyof typeof iconMap;
};

export const IconShortButton = forwardRef<HTMLButtonElement, IconButtonType>(
  ({ children, icon, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(button({ size: "short" }), className)}
        onClick={onClick}
        {...props}
      >
        <img src={iconMap[icon]} />
        {children}
      </button>
    );
  },
);
export const IconShortWarningButton = forwardRef<
  HTMLButtonElement,
  IconButtonType
>(({ children, icon, className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(button({ size: "short", color: "warning" }), className)}
      onClick={onClick}
      {...props}
    >
      <img src={iconMap[icon]} />
      {children}
    </button>
  );
});
export const IconButton = forwardRef<HTMLButtonElement, IconButtonType>(
  ({ children, icon, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(button(), className)}
        onClick={onClick}
        {...props}
      >
        <img src={iconMap[icon]} className="size-5" />
        {children}
      </button>
    );
  },
);

export const IconWarningButton = forwardRef<HTMLButtonElement, IconButtonType>(
  ({ children, icon, onClick, className, ...props }, ref) => {
    return (
      <button
        className={cn(button({ color: "warning" }), className)}
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

const IconButtonBorderLess = forwardRef<
  HTMLButtonElement,
  {
    children?: ReactNode;
    icon: keyof typeof iconMap;
    onClick?: () => void;
    className?: string;
  }
>(({ children, icon, onClick, className }, ref) => {
  return (
    <button
      ref={ref}
      className={twMerge(
        button({ borderLess: true, class: "h-full" }),
        className,
      )}
      onClick={onClick}
    >
      <img className="h-5 w-5" src={iconMap[icon]} />
      {children}
    </button>
  );
});

export { IconButtonBorderLess };

export const TextButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<"button"> & { loading?: boolean; disabled?: boolean }
>(({ children, className, onClick, loading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        button({ iconLess: true, size: "wide" }),
        "whitespace-nowrap",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {loading && <img src={circleIcon} className="h-5 w-5 animate-spin" />}
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
        "whitespace-nowrap",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
});
