import magnifyingGlass from "@/assets/magnifying-glass-icon.svg";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

export function SearchInput() {
  const [value, setValue] = useState("");

  const [isCursorOut, setIsCursorOut] = useState(false);
  const isActive = !isCursorOut ? true : !!value;

  return (
    <motion.label
      className={cn(
        "flex h-11 cursor-pointer items-center gap-1 border border-line-gray bg-light-gray px-3 ",
        value && isCursorOut && "border-[1.5px]",
      )}
      animate={{
        width: isActive ? 250 : 46,
        borderColor: isActive ? "var(--orange)" : "",
      }}
      transition={{ duration: 0.1 }}
    >
      <img src={magnifyingGlass} />
      <input
        onFocus={() => setIsCursorOut(false)}
        onBlur={() => setIsCursorOut(true)}
        type="text"
        className={cn("bg-transparent outline-none")}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </motion.label>
  );
}
