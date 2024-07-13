export function GraphRevenueCell({
  title,
  amount,
  leftSlot,
}: {
  title: string;
  amount: number;
  leftSlot?: React.ReactNode;
}) {
  const nf = new Intl.NumberFormat("en-us");

  return (
    <div className="flex gap-3 bg-light-blue/10 px-3 py-2.5">
      {leftSlot}
      <div className="font-bold">
        <p className="text-sm">{title}</p>
        <p className="text-3xl text-secondary-purple">{nf.format(amount)}</p>
      </div>
    </div>
  );
}
