import plusIcon from "@/assets/plus-icon.svg";
import { button } from "@/components/ui/button-cn";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function Section({
  title,
  subTitle,
  inputButton,
  children,
  disabled,
  myRef,
}: {
  title: string;
  subTitle?: string;
  inputButton?: {
    element: React.ReactElement;
    text: string;
  };
  children: React.ReactNode;
  disabled?: boolean;
  myRef?: React.MutableRefObject<HTMLElement | null>;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={(o) => {
        sectionRef.current = o;
        if (myRef) myRef.current = o;
      }}
    >
      <header className="flex items-center py-2.5 pl-5 ">
        <span className="font-semibold">{title}</span>
        {subTitle && (
          <span className="ml-1 text-sm text-word-red">{subTitle}</span>
        )}

        {inputButton && (
          <label
            className={cn(
              "relative ml-auto cursor-pointer bg-white",
              disabled && "cursor-not-allowed opacity-50",
            )}
            onClickCapture={(e) => disabled && e.stopPropagation()}
          >
            <div className={cn(button({ size: "short" }))}>
              <img src={plusIcon} />
              {inputButton.text}
            </div>
            {inputButton.element}
          </label>
        )}
      </header>

      <div className="border-y border-line-gray bg-white text-center text-word-gray">
        {children}
      </div>
    </section>
  );
}
