import { CircularProgressBar } from "@/components/circular-progress-bar";

export function CircularProgressWithDesc({
  filledPercentage,
  type = "primary",
  label,
  amount,
}: {
  filledPercentage: number;
  type?: "primary" | "secondary";
  label: string;
  amount: number;
}) {
  const nf = new Intl.NumberFormat("en-us");

  return (
    <div className="flex gap-2.5">
      <CircularProgressBar filledPercentage={filledPercentage} type={type} />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xl text-secondary-purple">{nf.format(amount)}</p>
      </div>
    </div>
  );
}
