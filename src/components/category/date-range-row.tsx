import { DatePicker } from "@/components/date-picker";
import { addDays, addYears } from "date-fns";
import { useState } from "react";
// import greenFileIcon from "@/assets/green-file-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";
import { DateRange } from "@/utils/category/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function DateRangeRow({
  onRemove,
  onSave,
  data,
  onEdit,
  disabled,
  // errorMessage,
  myRef,
}: {
  onRemove: () => void;
  onSave: (dr: DateRange) => void;
  data: DateRange;
  onEdit: () => void;
  disabled?: boolean;
  // errorMessage?: string;
  myRef?: React.RefObject<HTMLLIElement>;
}) {
  const [start, setStart] = useState<Date | undefined>(data.start);
  const [end, setEnd] = useState<Date | undefined>(data.end);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
  });

  // console.log(data);

  function onSaveDateRange(start: Date | undefined, end: Date | undefined) {
    // if (!start)
    //   setErrorFields((errorFields) => ({ ...errorFields, start: true }));
    // if (!end) setErrorFields((errorFields) => ({ ...errorFields, end: true }));

    if (start && end) {
      onSave({
        id: data.id,
        start,
        end,
        saved: true,
      });
    } else {
      onSave({
        id: data.id,
        start: undefined,
        end: undefined,
        saved: true,
      });
    }
  }

  // const errorMsg = errorFields.start
  //   ? "請選起始日"
  //   : errorFields.end
  //     ? "請選結束日"
  //     : errorMessage
  //       ? errorMessage
  //       : "";

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-y-1 border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 sm:px-2",
        !data.saved && "border-b-orange bg-hover-orange",
        disabled && "opacity-50",
      )}
      ref={myRef}
    >
      <DatePicker
        date={start}
        setDate={(e) => {
          setStart(e);
          if (end && e) onSaveDateRange(e, end);
        }}
        error={!!errorFields["start"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, start: false }))}
        toDate={end ? addDays(end, -1) : undefined}
        onEdit={onEdit}
        disabled={disabled}
      />
      <span className="px-2.5 text-secondary-dark">～</span>
      <DatePicker
        date={end}
        setDate={(e) => {
          setEnd(e);
          if (start && e) {
            onSaveDateRange(start, e);
          }
        }}
        error={!!errorFields["end"]}
        clearError={() => setErrorFields((ef) => ({ ...ef, end: false }))}
        fromDate={start ? addDays(start, 1) : undefined}
        onEdit={onEdit}
        disabled={disabled}
      />

      <Label className="ml-2.5 flex items-center gap-2 text-secondary-dark">
        <Checkbox
          className="disabled:opacity-25"
          // checked={start === "00:00:00" && end === "23:59:00"}
          onCheckedChange={
            (e) => {
              setStart(new Date());
              setEnd(addYears(new Date(), 100));
              if (e) onSaveDateRange(new Date(), addYears(new Date(), 100));
              else {
                setStart(undefined);
                setEnd(undefined);
                onSaveDateRange(undefined, undefined);
              }
            }
            // setFullHoursChecked(e);
          }
          // disabled={isInputDisabled}
        />
        無期限
      </Label>

      <div className="ml-auto flex gap-4 sm:ml-2">
        {/* {errorMsg && <span className="text-red-500">{errorMsg}</span>} */}
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
            {/* <button type="button" onClick={onSaveDateRange}>
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
