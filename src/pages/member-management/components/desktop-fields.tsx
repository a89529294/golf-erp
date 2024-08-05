import { cn } from "@/lib/utils";
import { BirthDayDatePicker } from "@/pages/member-management/components/birthday-date-picker";
import { FormSelect } from "@/pages/member-management/components/form-select";
import { UnderScoredFormInput } from "@/pages/member-management/components/underscored-form-input";
import {
  genderEnChMap,
  memberTypeEnChMap,
} from "@/pages/member-management/loader";

export function DesktopFields({
  memberTypeRef,
  genderRef,
  disabled,
}: {
  memberTypeRef: React.RefObject<HTMLButtonElement>;
  genderRef: React.RefObject<HTMLButtonElement>;
  disabled: boolean;
}) {
  return (
    <>
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
    </>
  );
}

function Cell({
  children,
  htmlFor,
  withBottomBorder,
  withGapBorder,
  onClick,
  className,
}: {
  children?: React.ReactNode;
  htmlFor?: string;
  withBottomBorder?: boolean;
  withGapBorder?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "relative flex sm:hidden",
        withBottomBorder && "border-b border-line-gray ",
        withGapBorder &&
          "after:absolute after:left-full after:top-full after:block after:w-10 after:border-b after:border-line-gray",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </label>
  );
}
