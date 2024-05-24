import { cn } from "@/lib/utils";
import { VenueSettingsRowContent } from "@/utils/category/schemas";
import React, { useRef, useState } from "react";
import { UnderscoredInput } from "../underscored-input";
import { onChange } from "@/pages/indoor-simulator/site-management/new/helpers";
import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import blackTrashCanIcon from "@/assets/black-trash-can-icon.svg";
import pencilIcon from "@/assets/pencil.svg";

export function VenueSettingsRow({
  onRemove,
  onSave,
  onEdit,
  data,
  formDisabled,
}: {
  data: VenueSettingsRowContent;
  onRemove(): void;
  onEdit(): void;
  onSave(arg: VenueSettingsRowContent): void;
  formDisabled?: boolean;
}) {
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [fee, setFee] = useState(data.fee);
  const [numberOfGroups, setNumberOfGroups] = useState(data.numberOfGroups);
  const [numberOfBalls, setNumberOfBalls] = useState(data.numberOfBalls);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const feeRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    start: false,
    end: false,
    fee: false,
    numberOfGroups: false,
    numberOfBalls: false,
  });
  const disabled = data.saved;

  function onSaveTimeRange() {
    const startError = start.length !== 5;
    const endError = end.length !== 5;
    const feeError = fee === "";
    const groupError = numberOfGroups === "";
    const ballError = numberOfBalls === "";

    if (startError) setErrorFields((ef) => ({ ...ef, start: true }));
    if (endError) setErrorFields((ef) => ({ ...ef, end: true }));
    if (feeError) setErrorFields((ef) => ({ ...ef, fee: true }));
    if (groupError) setErrorFields((ef) => ({ ...ef, numberOfGroups: true }));
    if (ballError) setErrorFields((ef) => ({ ...ef, numberOfBalls: true }));

    const hasErrors =
      startError || endError || feeError || groupError || ballError;
    if (hasErrors) return;

    onSave({
      id: data.id,
      start,
      end,
      fee,
      saved: true,
      numberOfBalls,
      numberOfGroups,
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
            "h-7 w-16 px-1 text-center ",
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
          disabledClassNames={disabledClassNames}
        />

        <span className="text-secondary-dark">～</span>
        <UnderscoredInput
          className={cn(
            "h-7 w-16 px-1 text-center",
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
          disabledClassNames={disabledClassNames}
        />
      </div>

      <NumberCell
        label="1小時"
        unit="元"
        myRef={feeRef}
        errorFields={errorFields}
        clearFieldError={(arg) => clearFieldError(arg)}
        disabled={disabled}
        field="fee"
        onEdit={onEdit}
        placeholder="價錢"
        state={fee}
        setState={setFee}
        disabledClassNames={disabledClassNames}
      />

      <NumberCell
        label="開放數量"
        unit="組"
        errorFields={errorFields}
        clearFieldError={(arg) => clearFieldError(arg)}
        disabled={disabled}
        field="numberOfGroups"
        onEdit={onEdit}
        placeholder="數量"
        state={numberOfGroups}
        setState={setNumberOfGroups}
        disabledClassNames={disabledClassNames}
      />

      <NumberCell
        label="球數"
        unit="顆"
        errorFields={errorFields}
        clearFieldError={(arg) => clearFieldError(arg)}
        disabled={disabled}
        field="numberOfBalls"
        onEdit={onEdit}
        placeholder="數量"
        state={numberOfBalls}
        setState={setNumberOfBalls}
        disabledClassNames={disabledClassNames}
      />

      <div className="ml-auto flex gap-4">
        {data.saved ? (
          <>
            <button type="button" onClick={onEdit} className="">
              <img src={pencilIcon} />
            </button>
            <button type="button" onClick={onRemove} className="">
              <img src={blackTrashCanIcon} />
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

function NumberCell<E>({
  label,
  myRef,
  field,
  errorFields,
  state,
  setState,
  placeholder,
  onEdit,
  clearFieldError,
  disabled,
  unit,
  disabledClassNames,
}: {
  label: string;
  myRef?: React.RefObject<HTMLInputElement>;
  field: keyof E;
  errorFields: E;
  state: number | "";
  setState: React.Dispatch<React.SetStateAction<number | "">>;
  placeholder: string;
  onEdit(): void;
  clearFieldError(arg: keyof E): void;
  disabled?: boolean;
  unit: string;
  disabledClassNames?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1.5 rounded bg-white px-4 pb-1.5 pt-2.5",
        disabled && "bg-light-gray",
      )}
    >
      <span>{label}</span>
      <UnderscoredInput
        ref={myRef}
        className={cn(
          "h-7 w-14 text-center",
          errorFields[field] && "border-b-destructive",
        )}
        value={state}
        onChange={(e) => {
          if (e.target.value === "") return setState("");
          const numericValue = +e.target.value;
          if (!Number.isNaN(numericValue) && numericValue >= 0)
            setState(numericValue);
        }}
        placeholder={placeholder}
        onFocus={() => {
          clearFieldError(field);
          onEdit();
        }}
        disabled={disabled}
        disabledClassNames={disabledClassNames}
      />
      <span>{unit}</span>
    </div>
  );
}
