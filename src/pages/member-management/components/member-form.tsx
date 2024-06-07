import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { BirthDayDatePicker } from "../components/birthday-date-picker";
import { Path, useFormContext, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { memberFormSchema } from "../schemas";
import { RefObject, useRef } from "react";
import { genderEnChMap, memberTypeEnChMap } from "../loader";
import { UnderscoredInput } from "@/components/underscored-input";
import { cn } from "@/lib/utils";

export function MemberForm({
  form,
  onSubmit,
  disabled,
  coin,
}: {
  form: UseFormReturn<z.infer<typeof memberFormSchema>>;
  onSubmit: (values: z.infer<typeof memberFormSchema>) => void;
  disabled: boolean;
  coin: number;
}) {
  const memberTypeRef = useRef<HTMLButtonElement>(null);
  const genderRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="w-full p-5 border border-line-gray bg-light-gray">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
          id="member-form"
          className="p-1 space-y-4 border border-line-gray"
        >
          <div className="grid grid-cols-[152fr_110fr_110fr_110fr_110fr_80fr_140fr_152fr] gap-x-10 pt-2.5">
            <Cell withBottomBorder withGapBorder />
            <Cell htmlFor="account" withBottomBorder withGapBorder>
              帳號
            </Cell>
            <Cell
              htmlFor="memberType"
              withBottomBorder
              withGapBorder
              onClick={() => {
                // needs to re-create keydownevent, otherwise it won't work
                const keyDownEvent = new KeyboardEvent("keydown", {
                  bubbles: true,
                  cancelable: true,
                  key: "Enter",
                  keyCode: 13,
                });
                memberTypeRef.current?.dispatchEvent(keyDownEvent);
              }}
            >
              會員類別
            </Cell>
            <Cell htmlFor="chName" withBottomBorder withGapBorder>
              姓名
            </Cell>
            <Cell htmlFor="phone" withBottomBorder withGapBorder>
              電話
            </Cell>
            <Cell
              htmlFor="gender"
              withBottomBorder
              withGapBorder
              onClick={() => {
                // needs to recreate keydownevent, otherwise it won't work
                const keyDownEvent = new KeyboardEvent("keydown", {
                  bubbles: true,
                  cancelable: true,
                  key: "Enter",
                  keyCode: 13,
                });
                genderRef.current?.dispatchEvent(keyDownEvent);
              }}
            >
              性別
            </Cell>
            <Cell htmlFor="birthday" withBottomBorder withGapBorder>
              生日
            </Cell>
            <Cell withBottomBorder />
            <Cell />
            <Cell>
              <UnderScoredFormInput
                name="account"
                placeholder="帳號"
                disabled={disabled}
              />
            </Cell>
            <Cell>
              <FormSelect
                myRef={memberTypeRef}
                name="memberType"
                optionMap={memberTypeEnChMap}
                disabled={disabled}
              />
            </Cell>
            <Cell>
              <UnderScoredFormInput
                name="chName"
                placeholder="姓名"
                disabled={disabled}
              />
            </Cell>
            <Cell>
              <UnderScoredFormInput
                name="phone"
                placeholder="電話"
                disabled={disabled}
              />
            </Cell>
            <Cell>
              <FormSelect
                name="gender"
                optionMap={genderEnChMap}
                myRef={genderRef}
                disabled={disabled}
              />
            </Cell>
            <Cell>
              <BirthDayDatePicker disabled={disabled} />
            </Cell>
            <Cell />
          </div>

          <div className="flex justify-center py-3 bg-secondary-dark">
            <div className="flex gap-36">
              <AmountCell label="累積消費金額" amount={coin} />
              <AmountCell label="消費儲值金額" amount={0} />
              <AmountCell label="剩餘消費金額" amount={0} />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

function AmountCell({ label, amount }: { label: string; amount: number }) {
  return (
    <div>
      <div className="font-medium text-white">{label}</div>
      <div className="text-white">
        ${" "}
        <span className="text-line-green">
          {new Intl.NumberFormat().format(amount)}
        </span>{" "}
        元
      </div>
    </div>
  );
}

function UnderScoredFormInput({
  name,
  placeholder,
  disabled,
}: {
  name: Path<z.infer<typeof memberFormSchema>>;
  placeholder?: string;
  disabled: boolean;
}) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <UnderscoredInput
              placeholder={placeholder}
              className="w-full px-1 pb-1"
              id={name}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormSelect({
  name,
  optionMap,
  myRef,
  disabled,
}: {
  name: Path<z.infer<typeof memberFormSchema>>;
  optionMap: Record<string, string>;
  myRef: RefObject<HTMLButtonElement>;
  disabled: boolean;
}) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                ref={myRef}
                className="px-1 pb-1 bg-transparent border-0 border-b rounded-none border-secondary-dark"
                disabled={disabled}
              >
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Object.entries(optionMap).map(([value, label]) => {
                return (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Cell({
  children,
  htmlFor,
  withBottomBorder,
  withGapBorder,
  onClick,
}: {
  children?: React.ReactNode;
  htmlFor?: string;
  withBottomBorder?: boolean;
  withGapBorder?: boolean;
  onClick?: () => void;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "relative flex ",
        withBottomBorder && "border-b border-line-gray ",
        withGapBorder &&
          "after:absolute after:left-full after:top-full after:block after:w-10 after:border-b after:border-line-gray",
      )}
      onClick={onClick}
    >
      {children}
    </label>
  );
}
