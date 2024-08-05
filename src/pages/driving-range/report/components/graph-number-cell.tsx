import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("en-US");

export default function GraphNumberCell({
  title,
  subTitle,
  number,
  secondary,
}: {
  title: string;
  subTitle: React.ReactNode;
  number: number;
  secondary?: boolean;
}) {
  return (
    <div
      className={cn(
        " p-4",
        secondary
          ? "rounded-b-md bg-light-gray"
          : "rounded-t-md bg-[rgba(136,206,213,0.1)]",
      )}
    >
      <p className="text-word-gray-dark text-sm font-bold">{title}</p>
      <div className="flex gap-2 text-sm font-bold">{subTitle}</div>
      <p className="py-2.5 text-center text-3xl text-secondary-purple">
        {nf.format(number)}
      </p>
    </div>
  );
}
