// import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TimeRange } from "@/utils/category/schemas";
import { useRef, useState } from "react";

export function TimeRangeRow({
  data,
  onSave,
  onRemove,
  onEdit,
  disabled,
  myRef,
  errorMessage,
}: {
  data: TimeRange;
  onSave: (tr: TimeRange) => void;
  onRemove(): void;
  onEdit(): void;
  disabled?: boolean;
  myRef: React.RefObject<HTMLLIElement>;
  errorMessage?: string;
}) {
  const [start, setStart] = useState(data[0].start);
  const [end, setEnd] = useState(data[0].end);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
  });

  function onSaveTimeRange(start: string, end: string) {
    // const startError = !start;
    // const endError = !end;

    // if (startError) {
    //   setErrorFields((ef) => ({ ...ef, start: true }));
    //   startRef.current?.click();
    //   return;
    // }
    // if (endError) {
    //   setErrorFields((ef) => ({ ...ef, end: true }));
    //   endRef.current?.click();
    //   return;
    // }

    onSave([
      {
        start,
        end,
        saved: true,
      },
    ]);
  }

  return (
    <li
      className={cn(
        "flex items-center border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark sm:px-2",
        !data[0].saved && "border-b-orange bg-hover-orange",
        disabled && "opacity-50",
      )}
      ref={myRef}
    >
      <Input
        type="time"
        className={cn(
          "h-7 w-24 rounded-none border-0 border-b border-secondary-dark bg-transparent font-mono",
          errorFields.start && "border-red-500",
        )}
        onClick={(e) => {
          e.currentTarget.showPicker();
          onEdit();
        }}
        onChange={(e) => {
          const val = e.currentTarget.value + ":00";
          setStart(val);
          if (val) {
            setErrorFields((ef) => ({ ...ef, start: false }));
            if (end) onSaveTimeRange(val, end);
          }
        }}
        value={start}
        ref={startRef}
        max={end}
        disabled={disabled}
      />

      <span className="px-2.5 text-secondary-dark">～</span>

      <Input
        type="time"
        className="h-7 w-24 rounded-none border-0 border-b border-b-secondary-dark bg-transparent font-mono *:w-full"
        onClick={(e) => {
          e.currentTarget.showPicker();
          onEdit();
        }}
        onChange={(e) => {
          const val = e.currentTarget.value + ":00";
          setEnd(val);
          if (val) {
            setErrorFields((ef) => ({ ...ef, end: false }));
            if (start) onSaveTimeRange(start, val);
          }
        }}
        value={end}
        ref={endRef}
        min={start}
        disabled={disabled}
      />

      <div className="ml-auto flex gap-4">
        <span className="text-red-500">{errorMessage}</span>
        {data[0].saved ? (
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
            {/* <button type="button" onClick={onSaveTimeRange}>
              <img src={greenFileIcon} />
            </button> */}
            <button type="button" onClick={onRemove}>
              <img src={redXIcon} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
