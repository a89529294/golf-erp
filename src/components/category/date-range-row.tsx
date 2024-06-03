import { DatePicker } from "@/components/date-picker";
import { addDays } from "date-fns";
import { useState } from "react";
import greenFileIcon from "@/assets/green-file-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";
import { DateRange } from "@/utils/category/schemas";

export function DateRangeRow({
  onRemove,
  onSave,
  data,
  onEdit,
  disabled,
  errorMessage,
  myRef,
}: {
  onRemove: () => void;
  onSave: (dr: DateRange) => void;
  data: DateRange;
  onEdit: () => void;
  disabled?: boolean;
  errorMessage?: string;
  myRef?: React.RefObject<HTMLLIElement>;
}) {
  const [start, setStart] = useState<Date | undefined>(data.start);
  const [end, setEnd] = useState<Date | undefined>(data.end);
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

  const errorMsg = errorFields.start
    ? "請選起始日"
    : errorFields.end
      ? "請選結束日"
      : errorMessage
        ? errorMessage
        : "";

  return (
    <li
      className={cn(
        "flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 ",
        !data.saved && "border-b-orange bg-hover-orange",
        disabled && "opacity-50",
      )}
      ref={myRef}
    >
      <DatePicker
        date={start}
        setDate={setStart}
        error={!!errorFields["start"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, start: false }))}
        toDate={end ? addDays(end, -1) : undefined}
        onEdit={onEdit}
        disabled={disabled}
      />
      <span className="px-2.5 text-secondary-dark">～</span>
      <DatePicker
        date={end}
        setDate={setEnd}
        error={!!errorFields["end"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, end: false }))}
        fromDate={start ? addDays(start, 1) : undefined}
        onEdit={onEdit}
        disabled={disabled}
      />

      <div className="ml-auto flex gap-4">
        {errorMsg && <span className="text-red-500">{errorMsg}</span>}
        {data.saved ? (
          <>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className={cn(disabled && "cursor-not-allowed")}
            >
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
