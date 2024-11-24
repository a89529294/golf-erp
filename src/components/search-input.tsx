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
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  className?: string;
  isFocused?: boolean;
  setIsFocused?: Dispatch<SetStateAction<boolean>>;
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
    <motion.div
      className="border"
      style={{ borderColor: isActive ? "rgb(233 158 24)" : "rgb(182 182 182)" }}
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
          width: isActive ? (isMobile ? 160 : 250) : 46,
        }}
        layout
        onMouseDown={() => setIsClickingInside(true)}
        onMouseUp={() => setIsClickingInside(false)}
        onFocus={() => {
          updateFocus(true);
          console.log("label focused");
        }}
        onBlur={(e) => {
          console.log("label blurred");
          if (isClickingInside) return;
          updateFocus(false);
        }}
      >
        <motion.img
          src={magnifyingGlass}
          layout="position"
          className="pointer-events-none touch-none"
        />

        <motion.input
          type="text"
          className={cn(
            "pointer-events-none w-0 touch-none bg-transparent outline-none",
            isActive && "w-40 sm:w-20",
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          layout
          onFocus={() => console.log("input focused")}
          onBlur={() => console.log("input blurred")}
        />

        {value && (
          <img src={x} className="ml-auto w-5" onClick={() => setValue("")} />
        )}
      </motion.label>
    </motion.div>
  );
}

// export function SearchInput({
//   value,
//   setValue,
//   disabled,
//   className,
//   isCursorOutFromParent,
//   setIsCursorOutFromParent,
// }: {
//   value: string;
//   setValue: Dispatch<SetStateAction<string>>;
//   disabled?: boolean;
//   className?: string;
//   isCursorOutFromParent?: boolean;
//   setIsCursorOutFromParent?: Dispatch<SetStateAction<boolean>>;
// }) {
//   const isMobile = useIsMobile();
//   const [isCursorOut, setIsCursorOut] = useState(true);
//   const cursorOut =
//     isCursorOutFromParent !== undefined ? isCursorOutFromParent : isCursorOut;
//   const isActive = !cursorOut ? true : !!value;

//   const [isClickingInside, setIsClickingInside] = useState(false);

//   return (
//     <motion.div
//       className="border"
//       style={{ borderColor: isActive ? "rgb(233 158 24)" : "rgb(182 182 182)" }}
//       layout
//     >
//       <motion.label
//         className={cn(
//           "flex h-11 cursor-pointer items-center gap-1 bg-light-gray px-3 ",
//           value && cursorOut && "border-[1.5px]",
//           disabled && " cursor-not-allowed opacity-50",
//           className,
//         )}
//         // animate={{
//         //   width: isActive ? (isMobile ? 160 : 250) : 46,
//         //   borderColor: isActive ? "rgb(233 158 24)" : "rgb(182 182 182)", // orange line-gray
//         // }}
//         style={{
//           width: isActive ? (isMobile ? 160 : 250) : 46,
//         }}
//         // transition={{ layout: { duration: 1000 } }}
//         layout
//         // onClick={() => {
//         //   setIsCursorOut((v) => !v);
//         // }}
//         onMouseDown={() => {
//           setIsClickingInside(true);
//         }}
//         onMouseUp={() => {
//           setIsClickingInside(false);
//         }}
//         onFocus={() => {
//           setIsCursorOut(false);
//           setIsCursorOutFromParent && setIsCursorOutFromParent(false);
//           console.log("!");
//         }}
//         onBlur={(e) => {
//           console.log(e.currentTarget, e.target, e.relatedTarget);
//           console.log(e.currentTarget.contains(e.target));

//           if (isClickingInside) return;

//           setIsCursorOut(true);
//           setIsCursorOutFromParent && setIsCursorOutFromParent(true);
//         }}
//       >
//         <motion.img
//           src={magnifyingGlass}
//           layout="position"
//           className="pointer-events-none touch-none"
//         />

//         <motion.input
//           type="text"
//           className={cn(
//             "pointer-events-none w-0 touch-none bg-transparent outline-none",
//             isActive && "w-40 sm:w-20",
//           )}
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           disabled={disabled}
//           layout

//           // transition={{ layout: { duration: 1000 } }}
//         />
//         <img
//           src={x}
//           className={cn(
//             "ml-auto w-0 opacity-0 transition-opacity delay-500",
//             !!value && "w-5 opacity-100",
//           )}
//           onClick={() => setValue("")}
//         />
//       </motion.label>
//     </motion.div>
//   );
// }
