import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { WeekDayContent } from "@/pages/golf/site-management/new/schemas";
import { onChange } from "@/pages/indoor-simulator/site-management/new/helpers";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export function WeekdayRow({
  data,
  onSave,
  onRemove,
  onEdit,
  disabled,
}: {
  data: WeekDayContent;
  onSave: (content: WeekDayContent) => void;
  onRemove(): void;
  onEdit(): void;
  disabled?: boolean;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [fee, setFee] = useState(data.fee);
  const [numberOfGroups, setNumberOfGroups] = useState(data.numberOfGroups);
  const [numberOfGolfBalls, setNumberOfGolfBalls] = useState(
    data.numberOfGolfBalls,
  );
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const feeRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLInputElement>(null);
  const ballRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
    fee: false,
    numberOfGroups: false,
    numberOfGolfBalls: false,
  });
  const {
    formState: { errors },
  } = useFormContext();
  console.log(errors);

  function onSaveWeekday() {
    const startError = start.length !== 5;
    const endError = end.length !== 5;
    const feeError = fee === "";
    const groupError = numberOfGroups === "";
    const ballError = numberOfGolfBalls === "";

    if (startError) setErrorFields((ef) => ({ ...ef, start: true }));
    if (endError) setErrorFields((ef) => ({ ...ef, end: true }));
    if (feeError) setErrorFields((ef) => ({ ...ef, fee: true }));
    if (groupError) setErrorFields((ef) => ({ ...ef, numberOfGroups: true }));
    if (ballError) setErrorFields((ef) => ({ ...ef, numberOfGolfBalls: true }));

    const hasErrors =
      startError || endError || feeError || groupError || ballError;
    if (hasErrors) return;

    onSave({
      id: data.id,
      start,
      end,
      fee,
      numberOfGroups,
      numberOfGolfBalls,
      saved: true,
    });
  }

  function clearFieldError(
    field: "start" | "end" | "fee" | "numberOfGroups" | "numberOfGolfBalls",
  ) {
    setErrorFields({
      ...errorFields,
      [field]: false,
    });
  }

  return (
    <li
      className={cn(
        "flex items-center gap-6 border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark ",
        !data.saved && "border-b-orange bg-hover-orange",
        disabled && "opacity-50",
      )}
    >
      <div className="flex gap-1.5">
        <UnderscoredInput
          className={cn(
            "h-7 w-16 px-0 text-center",
            errorFields["start"] && "border-b-destructive",
          )}
          value={start}
          onChange={(e) => {
            onChange(e, start, setStart, "start", start, end, endRef, feeRef);
            setEnd("");
          }}
          placeholder="00:00"
          inputMode="numeric"
          ref={startRef}
          onFocus={() => {
            clearFieldError("start");
            onEdit();
          }}
          disabled={disabled}
        />

        <span className=" text-secondary-dark">～</span>
        <UnderscoredInput
          className={cn(
            "h-7 w-16 px-0 text-center",
            errorFields["end"] && "border-b-destructive",
          )}
          value={end}
          onChange={(e) => {
            onChange(e, end, setEnd, "end", start, end, endRef, feeRef);
          }}
          placeholder="23:00"
          inputMode="numeric"
          ref={endRef}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && end.length === 0) {
              startRef.current?.focus();
              e.preventDefault();
            }
          }}
          onFocus={() => {
            clearFieldError("end");
            onEdit();
          }}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-1.5">
        <span>一小時</span>
        <UnderscoredInput
          ref={feeRef}
          className={cn(
            " h-7 w-14 px-0 text-center",
            errorFields["fee"] && "border-b-destructive",
          )}
          value={fee}
          onChange={(e) => {
            if (e.target.value === "") return setFee("");
            const numericValue = +e.target.value;
            if (!Number.isNaN(numericValue) && numericValue >= 0)
              setFee(numericValue);
          }}
          placeholder="價錢"
          onFocus={() => {
            clearFieldError("fee");
            onEdit();
          }}
          disabled={disabled}
        />
        <span>元</span>
      </div>

      <div className="flex gap-1.5">
        <span>開放數量</span>
        <UnderscoredInput
          ref={groupRef}
          className={cn(
            " h-7 w-14 px-0 text-center",
            errorFields["numberOfGroups"] && "border-b-destructive",
          )}
          value={numberOfGroups}
          onChange={(e) => {
            if (e.target.value === "") return setNumberOfGroups("");
            const numericValue = +e.target.value;
            if (!Number.isNaN(numericValue) && numericValue >= 0)
              setNumberOfGroups(numericValue);
          }}
          placeholder="數量"
          onFocus={() => {
            clearFieldError("numberOfGroups");
            onEdit();
          }}
          disabled={disabled}
        />
        <span>組</span>
      </div>

      <div className="flex gap-1.5">
        <span>球數</span>
        <UnderscoredInput
          ref={ballRef}
          className={cn(
            " h-7 w-14 px-0 text-center",
            errorFields["numberOfGolfBalls"] && "border-b-destructive",
          )}
          value={numberOfGolfBalls}
          onChange={(e) => {
            if (e.target.value === "") return setNumberOfGolfBalls("");
            const numericValue = +e.target.value;
            if (!Number.isNaN(numericValue) && numericValue >= 0)
              setNumberOfGolfBalls(numericValue);
          }}
          placeholder="數量"
          onFocus={() => {
            clearFieldError("numberOfGolfBalls");
            onEdit();
          }}
          disabled={disabled}
        />
        <span>組</span>
      </div>

      <div className="ml-auto flex gap-4">
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
            <button type="button" onClick={onSaveWeekday}>
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
