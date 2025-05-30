// import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onEdit?(): void;
  disabled?: boolean;
  myRef: React.RefObject<HTMLLIElement>;
  errorMessage?: string;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
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

    onSave({
      start,
      end,
      saved: true,
    });
  }

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-y-2 border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark sm:px-2",
        !data.saved && "border-b-orange bg-hover-orange",
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
          if (onEdit) onEdit();
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
        disabled={disabled}
      />

      <span className="px-2.5 text-secondary-dark">～</span>

      <Input
        type="time"
        className="h-7 w-24 rounded-none border-0 border-b border-b-secondary-dark bg-transparent font-mono *:w-full"
        onClick={(e) => {
          e.currentTarget.showPicker();
          if (onEdit) onEdit();
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
        disabled={disabled}
      />

      <Label className="ml-2.5 flex items-center gap-2 ">
        <Checkbox
          className="disabled:opacity-25"
          checked={start === "00:00:00" && end === "23:59:00"}
          onCheckedChange={(e) => {
            if (e === true) {
              setStart("00:00:00");
              setEnd("23:59:00");
              onSaveTimeRange("00:00:00", "23:59:00");
            } else {
              setStart("");
              setEnd("");
            }
            // setFullHoursChecked(e);
          }}
          // disabled={isInputDisabled}
        />
        24小時營業
      </Label>

      <div className="ml-auto flex gap-4 sm:ml-2 ">
        <span className="text-red-500">{errorMessage}</span>
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
