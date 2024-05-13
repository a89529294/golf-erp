import { useRef, useState } from "react";
import { type TimeRange } from "../schemas";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { onChange } from "@/pages/indoor-simulator/site-management/new/helpers";
import greenFileIcon from "@/assets/green-file-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";

export function TimeRangeRow({
  data,
  onSave,
  onRemove,
}: {
  data: TimeRange;
  onSave: (tr: TimeRange) => void;
  onRemove(): void;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [fee, setFee] = useState(data.fee);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const feeRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
    fee: false,
  });

  function onSaveTimeRange() {
    const startError = start.length !== 5;
    const endError = end.length !== 5;
    const feeError = fee === "";

    if (startError) setErrorFields((ef) => ({ ...ef, start: true }));
    if (endError) setErrorFields((ef) => ({ ...ef, end: true }));
    if (feeError) setErrorFields((ef) => ({ ...ef, fee: true }));

    const hasErrors = startError || endError || feeError;
    if (hasErrors) return;

    onSave({
      id: data.id,
      start,
      end,
      fee,
      saved: true,
    });
  }

  function clearFieldError(field: "start" | "end" | "fee") {
    setErrorFields({
      ...errorFields,
      [field]: false,
    });
  }

  return (
    <li
      className={cn(
        "flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark ",
        !data.saved && "border-b-orange bg-hover-orange",
      )}
    >
      <UnderscoredInput
        className={cn(
          "h-7 w-24 text-center",
          errorFields["start"] && "border-b-destructive",
        )}
        value={start}
        onChange={(e) => {
          onChange(e, start, setStart, "start", start, end, endRef, feeRef);
          setEnd("");
        }}
        placeholder="開始時間"
        inputMode="numeric"
        ref={startRef}
        onFocus={() => clearFieldError("start")}
        autoFocus
      />

      <span className="px-2.5 text-secondary-dark">～</span>
      <UnderscoredInput
        className={cn(
          "h-7 w-24 text-center",
          errorFields["end"] && "border-b-destructive",
        )}
        value={end}
        onChange={(e) =>
          onChange(e, end, setEnd, "end", start, end, endRef, feeRef)
        }
        placeholder="結束時間"
        inputMode="numeric"
        ref={endRef}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && end.length === 0) {
            startRef.current?.focus();
            e.preventDefault();
          }
        }}
        onFocus={() => clearFieldError("end")}
      />

      <UnderscoredInput
        ref={feeRef}
        className={cn(
          "ml-6 h-7 w-24 text-center",
          errorFields["fee"] && "border-b-destructive",
        )}
        value={fee}
        onChange={(e) => {
          console.log(e.target.value);
          if (e.target.value === "") return setFee("");
          const numericValue = +e.target.value;
          if (!Number.isNaN(numericValue) && numericValue >= 0)
            setFee(numericValue);
        }}
        placeholder="價錢"
        onFocus={() => clearFieldError("fee")}
      />
      <span>元</span>

      <div className="ml-auto flex gap-4">
        {data.saved ? (
          <>
            <button type="button" onClick={onRemove}>
              <img src={trashCanIcon} />
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onSaveTimeRange}>
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
