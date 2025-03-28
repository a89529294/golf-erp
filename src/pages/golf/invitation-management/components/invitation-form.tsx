import greenPlusIcon from "@/assets/green-plus-icon.svg";
import pfp from "@/assets/pfp-outline.svg";
import redMinusIcon from "@/assets/red-minus-icon.svg";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SimpleStore } from "@/utils/types";
import { useEffect } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "..";
import { AddressFields } from "../components/address-fields";
import { AppointmentDatePicker } from "../components/appointment-date-picker";
import { FeeFormField } from "../components/fee-form-field";
import { HeadcountFormField } from "../components/headcount-form-field";
import { TextFormField } from "../components/text-form-field";
import { TimeFormField } from "../components/time-form-field";
import { AppUserSelectModal } from "./app-user-select-modal";
import { inviteHostcolumns } from "./invite-host-columns";

export function InvitationForm({
  form,
  onSubmit,
  disabled,
  stores,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: SubmitHandler<z.infer<typeof formSchema>>;
  disabled?: boolean;
  stores: SimpleStore[];
}) {
  const headcount = form.watch("headcount");
  const headcountInvalid = headcount === "" || headcount === "0";
  const disableAddMember = +headcount <= form.watch("members").length + 1;
  const hostValue = form.watch("host");

  const numericHeadcount = +form.watch("headcount");
  useEffect(() => {
    if (numericHeadcount === 0) {
      form.setValue("host", []);
      form.setValue("members", []);
    } else {
      form.setValue(
        "members",
        form.getValues("members").slice(0, numericHeadcount - 1),
      );
    }
  }, [numericHeadcount, form]);

  return (
    <div className="mb-1 flex w-full flex-col border border-line-gray p-1">
      <header className="mb-12 bg-light-gray py-2.5 text-center text-black">
        編輯邀約
      </header>
      <Form {...form}>
        <form
          id="appointment-form"
          onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
          className="flex w-[600px] flex-1 flex-col self-center border border-line-gray sm:w-80"
        >
          <header className="bg-light-gray py-2.5 text-center text-black">
            邀約資料
          </header>
          <div className="flex-1 space-y-7 px-12 py-10 sm:px-6 sm:py-5">
            <TextFormField name="title" label="標題" disabled={disabled} />
            <TextFormField name="introduce" label="介紹" disabled={disabled} />
            <AppointmentDatePicker disabled={disabled} />
            <TimeFormField disabled={disabled} />
            <FeeFormField disabled={disabled} />
            <AddressFields stores={stores} disabled={disabled} />
            <HeadcountFormField disabled={disabled} />
          </div>
        </form>
        <div
          className={cn(
            "w-[600px] self-center border border-t-0 border-line-gray sm:w-80 ",
          )}
        >
          <header className="relative bg-light-gray py-2.5 text-center text-black">
            參與人員
            {headcountInvalid && (
              <h2 className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-9 text-red-500">
                (請先填入人數)
              </h2>
            )}
          </header>

          <div
            className={cn(
              "space-y-2 px-12 py-10 sm:px-6 sm:py-5",
              headcountInvalid && "opacity-50",
            )}
          >
            <div className="grid grid-cols-[1fr_415px] items-baseline sm:flex sm:flex-col sm:items-stretch sm:gap-1">
              <label>主辦人</label>
              <div className="flex items-center gap-2">
                <div className="grid size-10 place-items-center rounded-full border border-line-gray bg-light-gray ">
                  <img className="" src={pfp} />
                </div>
                <AppUserSelectModal
                  type="host"
                  columns={inviteHostcolumns}
                  dialogTriggerChildren={
                    <button
                      className={cn(
                        "flex flex-1 justify-between border-b border-secondary-dark pb-1 disabled:cursor-not-allowed disabled:opacity-50",
                        form.formState.errors.host &&
                          "border-red-500 text-red-500",
                      )}
                      disabled={headcountInvalid || disabled}
                    >
                      <div>
                        {(() => {
                          if (form.formState.errors.host)
                            return form.formState.errors.host.message;

                          return hostValue[0] ? hostValue[0].chName : "";
                        })()}
                      </div>
                      <img src={greenPlusIcon} />
                    </button>
                  }
                  isPending={false}
                  onSubmit={(users) => {
                    form.setValue("host", [users[0]], {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  enableMultiRowSelection={false}
                />
              </div>
            </div>

            <div
              className={cn(
                " grid grid-cols-[1fr_415px] items-baseline sm:flex sm:flex-col sm:items-stretch sm:gap-1",
              )}
            >
              <label>參與人員</label>
              <ul className="space-y-2">
                {[
                  ...form.watch("members"),
                  { id: "blank-item", chName: "" },
                ].map((m, idx) => {
                  return (
                    <li key={m.id} className="flex items-center gap-2">
                      <div className="grid size-10 place-items-center rounded-full border border-line-gray bg-light-gray">
                        <img className="" src={pfp} />
                      </div>
                      <div
                        className={cn(
                          "flex flex-1 border-b border-secondary-dark pb-1 pr-2",
                          disabled && "opacity-50",
                        )}
                      >
                        <span className="mr-auto">{m.chName}</span>
                        {idx < form.watch("members").length && (
                          <button
                            onClick={() => {
                              form.setValue(
                                "members",
                                form
                                  .getValues("members")
                                  .filter(
                                    (formMember) => formMember.id !== m.id,
                                  ),
                                {
                                  shouldDirty: true,
                                },
                              );
                              form.trigger("headcount");
                            }}
                          >
                            <img src={redMinusIcon} />
                          </button>
                        )}
                        {idx === form.watch("members").length && (
                          <AppUserSelectModal
                            type="members"
                            // hostValue={hostValue[0]}
                            columns={inviteHostcolumns}
                            dialogTriggerChildren={
                              <button
                                className="disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={disableAddMember || disabled}
                              >
                                <img src={greenPlusIcon} />
                              </button>
                            }
                            isPending={false}
                            onSubmit={(users) => {
                              form.setValue("members", users, {
                                shouldDirty: true,
                              });
                            }}
                            enableMultiRowSelection={true}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
