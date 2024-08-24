import { Label } from "@/components/ui/label";
import { BirthDayDatePicker } from "@/pages/member-management/members/components/birthday-date-picker";
import { FormSelect } from "@/pages/member-management/members/components/form-select";
import { UnderScoredFormInput } from "@/pages/member-management/members/components/underscored-form-input";
import {
  genderEnChMap,
  memberTypeEnChMap,
} from "@/pages/member-management/members/loader";

export function MobileFields({
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
      <LabeledInput label="帳號">
        <UnderScoredFormInput
          name="account"
          placeholder="帳號"
          disabled={disabled}
        />
      </LabeledInput>

      <LabeledInput label="會員類別">
        <FormSelect
          myRef={memberTypeRef}
          name="memberType"
          optionMap={memberTypeEnChMap}
          disabled={disabled}
        />
      </LabeledInput>
      <LabeledInput label="姓名">
        <UnderScoredFormInput
          name="chName"
          placeholder="姓名"
          disabled={disabled}
        />
      </LabeledInput>
      <LabeledInput label="電話">
        <UnderScoredFormInput
          name="phone"
          placeholder="電話"
          disabled={disabled}
        />
      </LabeledInput>
      <LabeledInput label="性別">
        <FormSelect
          name="gender"
          optionMap={genderEnChMap}
          myRef={genderRef}
          disabled={disabled}
        />
      </LabeledInput>
      <LabeledInput label="生日">
        <BirthDayDatePicker disabled={disabled} />
      </LabeledInput>
    </>
  );
}

function LabeledInput({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Label className="hidden items-baseline sm:flex">
      <span className="w-20">{label}</span>
      {children}
    </Label>
  );
}
