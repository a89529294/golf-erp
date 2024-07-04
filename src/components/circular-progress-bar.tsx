export function CircularProgressBar({
  size = 55,
  strokeWidth = 10,
  filledPercentage,
  type = "primary",
}: {
  size?: number;
  strokeWidth?: number;
  filledPercentage: number;
  type?: "primary" | "secondary";
}) {
  const unfilledLength =
    2 * Math.PI * ((size - strokeWidth) / 2) * (1 - filledPercentage / 100);
  const filledLength =
    (2 * Math.PI * ((size - strokeWidth) / 2) * filledPercentage) / 100;
  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={type === "primary" ? "#262873" : "var(--orange)"}
          strokeWidth={strokeWidth}
        ></circle>
        <circle
          className="origin-center -rotate-90"
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          fill="none"
          stroke={type === "primary" ? "#88CED5" : "#e4e4e4"}
          strokeWidth={strokeWidth}
          strokeDasharray={`${unfilledLength} ${filledLength}`}
        ></circle>
      </svg>
      <p className="text-sm font-bold tracking-tighter text-secondary-purple">
        {filledPercentage + "％"}
      </p>
    </div>
  );
}
