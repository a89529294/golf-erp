import greenFileIcon from "@/assets/green-file-icon.svg";
import redXIcon from "@/assets/red-x-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { LabeledUnderscoredInput } from "@/components/labeled-underscored-input";
import { IconShortButton } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";
import { onChange } from "@/pages/indoor-simulator/site-management/new/helpers";
import {
  MemberLevel,
  WeekdayContent,
  WeekdaySubRow,
} from "@/utils/category/schemas";
import { useRef, useState } from "react";

export function WeekdayRow({
  data,
  onSave,
  onRemove,
  onEdit,
  disabled,
}: {
  data: WeekdayContent;
  onSave: (content: WeekdayContent) => void;
  onRemove(): void;
  onEdit(): void;
  disabled?: boolean;
}) {
  const [title, setTitle] = useState(data.title);
  const [start, setStart] = useState(data.start);
  const [end, setEnd] = useState(data.end);
  const [numberOfGroups, setNumberOfGroups] = useState(data.numberOfGroups);
  const [subRows, setSubRows] = useState<WeekdaySubRow[]>(data.subRows);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLInputElement>(null);

  // const [errorFields, setErrorFields] = useState({
  //   start: false,
  //   end: false,
  //   fee: false,
  //   numberOfGroups: false,
  // });
  // const {
  //   formState: { errors },
  // } = useFormContext();

  function onAddSubRow() {
    setSubRows((pv) => [
      ...pv,
      {
        id: crypto.randomUUID(),
        memberLevel: "guest",
        partyOf1Fee: "",
        partyOf2Fee: "",
        partyOf3Fee: "",
        partyOf4Fee: "",
      },
    ]);
  }

  function onSaveWeekday() {
    const startError = start.length !== 5;
    const endError = end.length !== 5;
    const groupError = numberOfGroups === "";

    // if (startError) setErrorFields((ef) => ({ ...ef, start: true }));
    // if (endError) setErrorFields((ef) => ({ ...ef, end: true }));
    // if (groupError) setErrorFields((ef) => ({ ...ef, numberOfGroups: true }));

    const hasErrors = startError || endError || groupError;
    if (hasErrors) return;

    onSave({
      id: data.id,
      title,
      start,
      end,
      numberOfGroups,
      subRows,
      saved: true,
    });
  }

  // function clearFieldError(
  //   field: "start" | "end" | "numberOfGroups" ,
  // ) {
  //   setErrorFields({
  //     ...errorFields,
  //     [field]: false,
  //   });
  // }
  function onSubRowChange(
    id: string,
    field: "partyOf1Fee" | "partyOf2Fee" | "partyOf3Fee" | "partyOf4Fee",
    value: number,
  ) {
    setSubRows((pv) =>
      pv.map((subRow) =>
        subRow.id === id ? { ...subRow, [field]: value } : subRow,
      ),
    );
  }

  return (
    <li
      className={cn(
        "flex gap-4 border-b border-b-line-gray p-4 text-secondary-dark ",
        !data.saved && "bg-hover-orange",
        disabled && "opacity-50",
      )}
    >
      <div className="flex-1 space-y-4">
        <header className="flex gap-1.5">
          <LabeledUnderscoredInput
            label="標題"
            className="grow-[400] basis-0 bg-white p-4 pb-2.5"
            inputProps={{
              value: title,
              onChange: (e) => setTitle(e.target.value),
              onFocus: onEdit,
            }}
          />
          <div className="flex grow-[280] basis-0 items-center gap-1.5 bg-white p-4 pb-2.5">
            <label htmlFor={`start-time-${data.id}`}>開放時間</label>
            <UnderscoredInput
              className="flex-1 basis-0 px-0 text-center"
              id={`start-time-${data.id}`}
              ref={startRef}
              value={start}
              onChange={(e) =>
                onChange(
                  e,
                  start,
                  setStart,
                  "start",
                  start,
                  end,
                  endRef,
                  groupRef,
                )
              }
              onFocus={onEdit}
            />
            <span>～</span>
            <UnderscoredInput
              className="flex-1 basis-0 px-0 text-center"
              ref={endRef}
              value={end}
              onChange={(e) =>
                onChange(e, end, setEnd, "end", start, end, endRef, groupRef)
              }
              onFocus={onEdit}
            />
          </div>
          <LabeledUnderscoredInput
            label="開放組數"
            className="flex grow-[160] basis-0 bg-white p-4 pb-2.5"
            inputProps={{
              ref: groupRef,
              value: numberOfGroups,
              onChange: (e) => setNumberOfGroups(+e.target.value),
              onFocus: onEdit,
            }}
          />
        </header>
        <ul className="space-y-1">
          {subRows.map((sr) => {
            const subRowFromState = subRows.find(
              (stateSubRow) => stateSubRow.id === sr.id,
            )!;
            return (
              <li key={sr.id} className="flex bg-white px-4 py-2.5">
                <label className="flex grow-[5] basis-0 items-center gap-1.5 pr-4 after:relative after:-right-4 after:block after:h-6 after:border-r after:border-line-gray">
                  <span className="whitespace-nowrap">會員身份</span>
                  <Select
                    value={subRowFromState.memberLevel}
                    onValueChange={(v) =>
                      setSubRows((pv) =>
                        pv.map((subRow) =>
                          subRow.id === sr.id
                            ? { ...subRow, memberLevel: v as MemberLevel }
                            : subRow,
                        ),
                      )
                    }
                    onOpenChange={(v) => v && onEdit()}
                  >
                    <SelectTrigger className="rounded-none border-0 border-b-[1.5px] border-b-orange data-[placeholder]:border-b data-[placeholder]:border-b-secondary-dark data-[placeholder]:text-secondary-dark">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">來賓</SelectItem>
                      <SelectItem value="group-user">團體會員</SelectItem>
                      <SelectItem value="common-user">會員</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <LabeledUnderscoredInput
                  label="1人"
                  className="grow-[4] basis-0 px-4 tracking-widest after:relative after:-right-4 after:block after:h-6 after:border-r after:border-line-gray"
                  inputProps={{
                    type: "number",
                    onFocus: onEdit,
                    value: sr.partyOf1Fee,
                    onChange: (e) =>
                      onSubRowChange(sr.id, "partyOf1Fee", +e.target.value),
                  }}
                />
                <LabeledUnderscoredInput
                  label="2人"
                  className="grow-[4] basis-0 px-4 tracking-widest after:relative after:-right-4 after:block after:h-6 after:border-r after:border-line-gray"
                  inputProps={{
                    type: "number",
                    onFocus: onEdit,
                    value: sr.partyOf2Fee,
                    onChange: (e) =>
                      onSubRowChange(sr.id, "partyOf2Fee", +e.target.value),
                  }}
                />
                <LabeledUnderscoredInput
                  label="3人"
                  className="grow-[4] basis-0 px-4 tracking-widest after:relative after:-right-4 after:block after:h-6 after:border-r after:border-line-gray"
                  inputProps={{
                    type: "number",
                    onFocus: onEdit,
                    value: sr.partyOf3Fee,
                    onChange: (e) =>
                      onSubRowChange(sr.id, "partyOf3Fee", +e.target.value),
                  }}
                />
                <LabeledUnderscoredInput
                  label="4人"
                  className="grow-[5] basis-0 px-4  tracking-widest "
                  inputProps={{
                    type: "number",
                    className: "mr-8",
                    onFocus: onEdit,
                    value: sr.partyOf4Fee,
                    onChange: (e) =>
                      onSubRowChange(sr.id, "partyOf4Fee", +e.target.value),
                  }}
                />
              </li>
            );
          })}
          <IconShortButton
            icon="plus"
            className="w-full justify-center"
            onClick={() => {
              onAddSubRow();
              onEdit();
            }}
            type="button"
          >
            新增細項
          </IconShortButton>
        </ul>
      </div>

      {/* 33 is half of the height of the row to the left */}
      <div className="relative top-[33px] flex -translate-y-1/2 gap-4 self-start">
        {data.saved ? (
          <div className="flex w-14 justify-end">
            <button
              type="button"
              onClick={() => {
                onRemove();
                onEdit();
              }}
              disabled={disabled}
              className={cn(disabled && "cursor-not-allowed")}
            >
              <img src={trashCanIcon} />
            </button>
          </div>
        ) : (
          <div className="flex w-14 justify-between">
            <button type="button" onClick={onSaveWeekday}>
              <img src={greenFileIcon} />
            </button>
            <button type="button" onClick={onRemove}>
              <img src={redXIcon} />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
