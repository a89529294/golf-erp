import { tv } from "tailwind-variants";
import leaveIcon from "@/assets/leave-icon.svg";
import plusIcon from "@/assets/plus-icon.svg";
import pfpIcon from "@/assets/pfp-icon.svg";
import magnifyingGlassIcon from "@/assets/magnifying-glass-icon.svg";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const iconMap = {
  leave: leaveIcon,
  plus: plusIcon,
  magnifyingGlass: magnifyingGlassIcon,
  pfp: pfpIcon,
};

const button = tv({
  base: "flex h-11 items-center gap-1 bg-light-gray px-3 outline outline-1 outline-line-gray hover:outline-[1.5px] hover:outline-orange focus-visible:outline-[1.5px] focus-visible:outline-orange",
  variants: {
    borderLess: {
      true: "px-5 outline-0 hover:outline-0 focus-visible:outline-0",
    },
  },
});

export const IconButton = ({
  children,
  icon,
}: {
  children?: ReactNode;
  icon: keyof typeof iconMap;
}) => {
  return (
    <button className={button()}>
      <img src={iconMap[icon]} />
      {children}
    </button>
  );
};

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
