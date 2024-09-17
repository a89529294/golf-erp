import { cn } from "@/lib/utils";

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-5">
      <div className="w-16">{label}</div>

      <div
        className={cn(
          "h-7 flex-1 rounded-none border-0 border-b border-b-secondary-dark bg-transparent p-1",
        )}
      >
        {value}
      </div>
    </div>
  );
}
