import { tv } from "tailwind-variants";

export const button = tv({
  base: "flex h-11 items-center gap-1 whitespace-nowrap bg-light-gray px-3 outline outline-1 outline-line-gray hover:outline-[1.5px] hover:outline-orange focus-visible:outline-[1.5px] focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:outline-1 disabled:hover:outline-line-gray",
  variants: {
    borderLess: {
      true: "px-5 outline-0 hover:outline-0 focus-visible:outline-0",
    },
    color: {
      warning:
        "bg-btn-red text-word-red outline-line-red hover:outline-line-red-hover",
    },
    iconLess: {
      true: "",
    },
    size: {
      wide: "px-8",
      short: "h-8 sm:px-2",
    },
  },
});
