// import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plan } from "@/utils/category/schemas";
import { useRef, useState } from "react";

export function PlanRow({
  data,
  onSave,
  onRemove,
  disabled,
  myRef,
  errorMessage,
}: {
  data: Plan;
  onSave: (tr: Plan) => void;
  onRemove(): void;
  disabled?: boolean;
  myRef: React.RefObject<HTMLLIElement>;
  errorMessage?: string;
}) {
  const [title, setTitle] = useState(data.title);
  const [hours, setHours] = useState(data.hours);
  const [price, setPrice] = useState(data.price);
  const titleRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const [errorFields, setErrorFields] = useState({
    title: false,
    hours: false,
    price: false,
  });

  function onSaveTimeRange(
    title: string,
    hours: number | string,
    price: number | string,
  ) {
    // const titleError = !title;
    // const hoursError = hours === "";
    // const priceError = price === "";

    // if (titleError) {
    //   setErrorFields((ef) => ({ ...ef, title: true }));
    //   titleRef.current?.focus();
    //   return;
    // }
    // if (hoursError) {
    //   setErrorFields((ef) => ({ ...ef, hours: true }));
    //   hoursRef.current?.focus();

    //   return;
    // }
    // if (priceError) {
    //   setErrorFields((ef) => ({ ...ef, price: true }));
    //   priceRef.current?.focus();
    //   return;
    // }

    onSave({
      id: data.id,
      title,
      hours,
      price,
      saved: true,
    });
  }

  function clearErrorField(field: keyof typeof errorFields) {
    setErrorFields((ef) => ({ ...ef, [field]: false }));
  }

  return (
    <li
      className={cn(
        "flex items-center gap-4 border-b-[1.5px] border-b-transparent pb-4 pl-8 pr-5 pt-5 text-secondary-dark sm:gap-2 sm:px-2",
        !data.saved && "border-b-orange bg-hover-orange sm:bg-transparent",
        disabled && "opacity-50",
      )}
      ref={myRef}
    >
      <Input
        className={cn(
          "h-7 w-52 rounded-none border-0 border-b border-secondary-dark bg-transparent font-mono sm:w-24",
          errorFields.title && "border-red-500",
        )}
        onChange={(e) => {
          const trimmedValue = e.currentTarget.value;
          setTitle(trimmedValue);
          if (trimmedValue) {
            clearErrorField("title");
            if (hours && price) onSaveTimeRange(trimmedValue, hours, price);
          }
        }}
        value={title}
        ref={titleRef}
        placeholder="方案名稱"
      />

      <Input
        className={cn(
          "h-7 w-32 rounded-none border-0 border-b border-b-secondary-dark bg-transparent font-mono sm:w-24 ",
          errorFields.hours && "border-red-500",
        )}
        onChange={(e) => {
          const value = e.target.value === "" ? "" : +e.target.value;
          setHours(value);
          if (value !== "") {
            clearErrorField("hours");
            onSaveTimeRange(title, value, price);
          }
        }}
        value={hours}
        ref={hoursRef}
        placeholder="時數(小時)"
        type="number"
      />

      <div className="relative ">
        <Input
          className={cn(
            "h-7 w-32 rounded-none border-0 border-b border-b-secondary-dark bg-transparent font-mono *:w-full ",
            errorFields.price && "border-red-500",
          )}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : +e.target.value;
            setPrice(value);
            if (value !== "") {
              clearErrorField("price");
              onSaveTimeRange(title, hours, value);
            }
          }}
          value={price}
          ref={priceRef}
          placeholder="費用"
          type="number"
        />
        <div className="absolute right-0 top-1/2 -translate-y-1/2">元</div>
      </div>

      <div className="ml-auto flex shrink-0 gap-4 sm:w-10 sm:gap-2">
        <span className="text-red-500 ">{errorMessage}</span>
        {data.saved ? (
          <>
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className={cn("flex-1", disabled && "cursor-not-allowed")}
            >
              <img src={trashCanIcon} />
            </button>
          </>
        ) : (
          <>
            {/* <button type="button" onClick={onSaveTimeRange}>
              <img src={greenFileIcon} />
            </button> */}
            <button type="button" onClick={onRemove} className="w-full">
              <img src={redXIcon} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
