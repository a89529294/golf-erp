import { button } from "@/components/ui/button-cn";
import { cn } from "@/lib/utils";
import plusIcon from "@/assets/plus-icon.svg";

export function Section({
  title,
  subTitle,
  inputButtonElement,
  inputButtonText,
  children,
}: {
  title: string;
  subTitle?: string;
  inputButtonElement: React.ReactElement;
  inputButtonText: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <header className="flex items-center py-2.5 pl-5 ">
        <span className="font-semibold">{title}</span>
        {subTitle && (
          <span className="ml-1 text-sm text-word-red">{subTitle}</span>
        )}

        <label className="relative ml-auto bg-white">
          <div className={cn(button({ size: "short" }), "cursor-pointer")}>
            <img src={plusIcon} />
            {inputButtonText}
          </div>
          {inputButtonElement}
        </label>
      </header>

      <div className="border-y border-line-gray bg-white text-center text-word-gray">
        {children}
      </div>
    </section>
  );
}
