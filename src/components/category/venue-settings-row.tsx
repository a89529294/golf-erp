// import greenFileIcon from "@/assets/green-file-icon.svg";
// import pencilIcon from "@/assets/pencil.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import redTrashCanIcon from "@/assets/trash-can-icon.svg";
import { cn } from "@/lib/utils";
import { VenueSettingsRowContent } from "@/utils/category/schemas";
import React, { useRef, useState } from "react";
import { UnderscoredInput } from "../underscored-input";

export function VenueSettingsRow({
  onRemove,
  onSave,
  onEdit,
  data,
  formDisabled,
  // errorMessage,
  myRef,
}: {
  data: VenueSettingsRowContent;
  onRemove(): void;
  onEdit(): void;
  onSave(arg: VenueSettingsRowContent): void;
  formDisabled?: boolean;
  // errorMessage?: string;
  myRef?: React.RefObject<HTMLLIElement>;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
  });
  const disabled = data.saved;

  function onSaveTimeRange({ start, end }: { start: string; end: string }) {
    // const startError = start.length !== 5;
    // const endError = end.length !== 5;
    // const feeError = fee === "";
    // const groupError = numberOfGroups === "";
    // const ballError = numberOfBalls === "";

    // if (startError) setErrorFields((ef) => ({ ...ef, start: true }));
    // if (endError) setErrorFields((ef) => ({ ...ef, end: true }));
    // if (feeError) setErrorFields((ef) => ({ ...ef, fee: true }));
    // if (groupError) setErrorFields((ef) => ({ ...ef, numberOfGroups: true }));
    // if (ballError) setErrorFields((ef) => ({ ...ef, numberOfBalls: true }));

    // const hasErrors =
    //   startError || endError || feeError || groupError || ballError;
    // if (hasErrors) return;

    onSave({
      id: data.id,
      start,
      end,
      saved: true,
    });
  }

  function clearFieldError(field: keyof typeof errorFields) {
    setErrorFields({
      ...errorFields,
      [field]: false,
    });
  }

  const disabledClassNames = disabled ? "" : undefined;

  return (
    <li
      ref={myRef}
      className={cn(
        "flex items-center gap-1.5 border-b-[1.5px] border-b-transparent p-2 pr-5 text-secondary-dark",
        !data.saved && "border-b-orange bg-hover-orange",
        formDisabled && "opacity-50",
      )}
    >
      <div
        className={cn(
          "flex gap-1.5 rounded bg-white px-4 pb-1.5 pt-2.5",
          disabled && "bg-light-gray",
        )}
      >
        <UnderscoredInput
          className={cn(
            "h-7 w-24 px-1 text-center ",
            errorFields["start"] && "border-b-destructive",
          )}
          value={start}
          // onChange={(e) => {
          //   onChange(e, start, setStart, "start", start, end, endRef, feeRef);
          //   setEnd("");
          // }}
          onChange={(e) => {
            setStart(e.currentTarget.value);
            // setEnd("");

            if (e.currentTarget.value && end)
              onSaveTimeRange({
                start: e.currentTarget.value,
                end,
              });
          }}
          type="time"
          placeholder="00:00"
          inputMode="numeric"
          ref={startRef}
          onClick={() => {
            clearFieldError("start");
            onEdit();
          }}
          // disabled={disabled}
          disabledClassNames={disabledClassNames}
        />

        <span className="text-secondary-dark">～</span>
        <UnderscoredInput
          className={cn(
            "h-7 w-24 px-1 text-center",
            errorFields["end"] && "border-b-destructive",
          )}
          value={end}
          // onChange={(e) => {
          //   onChange(e, end, setEnd, "end", start, end, endRef, feeRef);
          // }}
          onChange={(e) => {
            setEnd(e.currentTarget.value);

            if (e.currentTarget.value && start)
              onSaveTimeRange({
                start,
                end: e.currentTarget.value,
              });
          }}
          type="time"
          placeholder="23:00"
          inputMode="numeric"
          ref={endRef}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && end.length === 0) {
              startRef.current?.focus();
              e.preventDefault();
            }
          }}
          onClick={() => {
            clearFieldError("end");
            onEdit();
          }}
          // disabled={disabled}
          disabledClassNames={disabledClassNames}
        />
      </div>

      <div className="ml-auto flex gap-4">
        {data.saved ? (
          <>
            {/* <button type="button" onClick={onEdit} className="">
              <img src={pencilIcon} />
            </button> */}
            <button type="button" onClick={onRemove} className="">
              <img src={redTrashCanIcon} />
            </button>
          </>
        ) : (
          <>
            {/* <span className="text-red-500">{errorMessage}</span> */}
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
