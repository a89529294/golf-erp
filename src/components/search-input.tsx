import magnifyingGlass from "@/assets/magnifying-glass-icon.svg";
import x from "@/assets/x.svg";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function SearchInput({
  value,
  setValue,
  disabled,
  className,
  isFocused,
  setIsFocused,
  mobileWidth,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  className?: string;
  isFocused?: boolean;
  setIsFocused?: Dispatch<SetStateAction<boolean>>;
  mobileWidth?: number;
}) {
  const isMobile = useIsMobile();
  const [internalFocused, setInternalFocused] = useState(false);
  const [isClickingInside, setIsClickingInside] = useState(false);

  // Use external focus state if provided, otherwise use internal
  const isInputFocused = isFocused !== undefined ? isFocused : internalFocused;
  const updateFocus = (focused: boolean) => {
    setIsFocused ? setIsFocused(focused) : setInternalFocused(focused);
  };

  const isActive = isInputFocused || !!value;

  return (
    <div className="outline outline-1 outline-line-gray hover:outline-[1.5px] hover:outline-orange">
      <motion.div
        className={cn("", isActive && "outline-orange")}
        // style={{ borderColor: isActive ? "rgb(233 158 24)" : "rgb(182 182 182)" }}
        layout
      >
        <motion.label
          className={cn(
            "flex h-11 cursor-pointer items-center gap-1 bg-light-gray px-3",
            value && !isInputFocused && "border-[1.5px]",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          style={{
            width: isActive ? (isMobile ? mobileWidth || 160 : 250) : 46,
          }}
          layout
          onMouseDown={() => setIsClickingInside(true)}
          onMouseUp={() => setIsClickingInside(false)}
          onFocus={() => {
            updateFocus(true);
          }}
          onBlur={(e) => {
            if (isClickingInside) return;
            updateFocus(false);
          }}
        >
          <motion.img
            src={magnifyingGlass}
            layout="position"
            className="pointer-events-none"
          />

          <motion.input
            type="text"
            className={cn(
              "w-full bg-transparent outline-none",
              !isActive && "w-0",
            )}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            disabled={disabled}
            layout
            onFocus={() => {
              updateFocus(true);
            }}
            onBlur={() => {
              if (!isClickingInside) {
                updateFocus(false);
              }
            }}
          />

          {value && (
            <img src={x} className="ml-auto w-5" onClick={() => setValue("")} />
          )}
        </motion.label>
      </motion.div>
    </div>
  );
}
