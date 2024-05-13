import { DatePicker } from "@/components/date-picker";
import { type DateRange } from "@/pages/indoor-simulator/site-management/new/schemas";
import { addDays } from "date-fns";
import { useState } from "react";
import greenFileIcon from "@/assets/green-file-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";

export function DateRangeRow({
  onRemove,
  onSave,
  data,
}: {
  onRemove: () => void;
  onSave: (dr: DateRange) => void;
  data: DateRange;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
  });

  function onSaveDateRange() {
    if (!start)
      setErrorFields((errorFields) => ({ ...errorFields, start: true }));
    if (!end) setErrorFields((errorFields) => ({ ...errorFields, end: true }));

    if (start && end) {
      onSave({
        id: data.id,
        start,
        end,
        saved: true,
      });
    }
  }

  return (
    <li
      className={cn(
        "flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 ",
        !data.saved && "border-b-orange bg-hover-orange",
      )}
    >
      <DatePicker
        date={start}
        setDate={setStart}
        error={!!errorFields["start"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, start: false }))}
        toDate={end ? addDays(end, -1) : undefined}
      />
      <span className="px-2.5 text-secondary-dark">～</span>
      <DatePicker
        date={end}
        setDate={setEnd}
        error={!!errorFields["end"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, end: false }))}
        fromDate={start ? addDays(start, 1) : undefined}
      />

      <div className="ml-auto flex gap-4">
        {data.saved ? (
          <>
            <button type="button" onClick={onRemove}>
              <img src={trashCanIcon} />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onSaveDateRange}>
              <img src={greenFileIcon} />
            </button>
            <button type="button" onClick={onRemove}>
              <img src={redXIcon} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
