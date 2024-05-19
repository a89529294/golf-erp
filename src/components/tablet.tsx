import { cn } from "@/lib/utils";

export function Tablet({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "flex h-5 w-10 items-center justify-center rounded-full border text-sm font-medium",
        active
          ? "border-secondary-purple text-secondary-purple"
          : "border-line-red text-word-red",
      )}
    >
      {active ? "恢復" : "停權"}
    </div>
  );
}
