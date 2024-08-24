import { Form } from "@/components/ui/form";
import { DesktopFields } from "@/pages/member-management/members/components/desktop-fields";
import { useRef } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { memberFormSchema } from "../schemas";
import { MobileFields } from "@/pages/member-management/members/components/mobile-fields";

export function MemberForm({
  form,
  onSubmit,
  disabled,
  topUpAmount,
  spentAmount,
  newMemberForm,
}: {
  form: UseFormReturn<z.infer<typeof memberFormSchema>>;
  onSubmit: (values: z.infer<typeof memberFormSchema>) => void;
  disabled: boolean;
  topUpAmount: number;
  spentAmount: number;
  newMemberForm?: boolean;
}) {
  const memberTypeRef = useRef<HTMLButtonElement>(null);
  const genderRef = useRef<HTMLButtonElement>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
        id="member-form"
        className="space-y-4 border border-line-gray p-1"
      >
        <div className="grid grid-cols-[152fr_110fr_110fr_110fr_110fr_80fr_140fr_152fr] gap-x-10 pt-2.5 sm:flex sm:flex-col">
          <DesktopFields
            disabled={disabled}
            memberTypeRef={memberTypeRef}
            genderRef={genderRef}
          />
          <MobileFields
            disabled={disabled}
            memberTypeRef={memberTypeRef}
            genderRef={genderRef}
          />
        </div>

        {!newMemberForm && (
          <div className="flex justify-center bg-secondary-dark py-3">
            <div className="flex gap-36 sm:flex-col sm:gap-4">
              <AmountCell label="累積消費金額" amount={spentAmount} />
              <AmountCell label="消費儲值金額" amount={topUpAmount} />
              <AmountCell
                label="剩餘消費金額"
                amount={topUpAmount - spentAmount}
              />
            </div>
          </div>
        )}
      </form>
    </Form>
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
