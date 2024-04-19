import { tv } from "tailwind-variants";
import leaveIcon from "@/assets/leave-icon.svg";
import plusIcon from "@/assets/plus-icon.svg";
import pfpIcon from "@/assets/pfp-icon.svg";
import magnifyingGlassIcon from "@/assets/magnifying-glass-icon.svg";
import { ReactNode } from "react";

const iconMap = {
  leave: leaveIcon,
  plus: plusIcon,
  magnifyingGlass: magnifyingGlassIcon,
  pfp: pfpIcon,
};

const button = tv({
  base: "border-line-gray flex h-11 items-center gap-1 border bg-light-gray px-3 hover:border-[1.5px] hover:border-orange focus-visible:border-[1.5px] focus-visible:border-orange focus-visible:outline-none",
  variants: {
    borderLess: {
      true: "border-none px-5",
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
      className={button({ borderLess: true, class: "h-full" })}
      onClick={onClick}
    >
      <img src={iconMap[icon]} />
      {children}
    </button>
  );
};
