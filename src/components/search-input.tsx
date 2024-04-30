import magnifyingGlass from "@/assets/magnifying-glass-icon.svg";
import x from "@/assets/x.svg";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";

export function SearchInput({
  value,
  setValue,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}) {
  const [isCursorOut, setIsCursorOut] = useState(true);
  const isActive = !isCursorOut ? true : !!value;

  return (
    <motion.label
      className={cn(
        "flex h-11 cursor-pointer items-center gap-1 border  bg-light-gray px-3 ",
        value && isCursorOut && "border-[1.5px]",
      )}
      animate={{
        width: isActive ? 250 : 46,
        borderColor: isActive ? "rgb(233 158 24)" : "rgb(182 182 182)", // orange line-gray
      }}
      transition={{ duration: 0.1 }}
    >
      <img src={magnifyingGlass} />

      <input
        onFocus={() => setIsCursorOut(false)}
        onBlur={() => setIsCursorOut(true)}
        type="text"
        className={cn("w-0 bg-transparent outline-none", isActive && "w-40")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <img
        src={x}
        className={cn(
          "ml-auto w-0 opacity-0 transition-opacity delay-500",
          !!value && "w-5 opacity-100",
        )}
        onClick={() => setValue("")}
      />
    </motion.label>
  );
}
