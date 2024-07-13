import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../schemas";

import greenPlusIcon from "@/assets/green-plus-icon.svg";
import redMinusIcon from "@/assets/red-minus-icon.svg";
import { AddEmployeeAsStoreManagerModal } from "@/components/select-employees-modal/add-employee-as-store-manager";
import { Employee } from "@/pages/system-management/personnel-management/loader";
import { SetStateAction, useState } from "react";
import { StoreFormAddressSelectFields } from "./store-form-address-select-field";
import { StoreFormField } from "./store-form-field";
import { StoreFormSelectField } from "./store-form-select-field";
import { IconShortButton } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function StoreForm({
  form,
  onSubmit,
  isMutating,
  counties,
  districts,
  employees,
  disabled,
  isSimulatorDetails,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isMutating: boolean;
  counties: {
    countycode: string;
    countyname: string;
  }[];
  districts:
    | {
        townname: string;
      }[]
    | undefined;
  employees: Employee[];
  disabled?: boolean;
  isSimulatorDetails?: boolean;
}) {
  const { storeId } = useParams();
  const [isOpeningGate, setIsOpeningGate] = useState(false);
  async function onOpenGate() {
    try {
      setIsOpeningGate(true);
      await privateFetch(`/store/simulator/open-main-gate/${storeId}`, {
        method: "POST",
      });
      toast.success("開啟大門成功");
    } catch (e) {
      console.log(e);
      toast.error("無法開啟大門");
    } finally {
      setIsOpeningGate(false);
    }
  }

  const isInputDisabled = !!(isMutating || disabled);
  return (
    <Form {...form}>
      <form
        id="store-form"
        onSubmit={form.handleSubmit(onSubmit, (error, event) => {
          console.log(error, event);
        })}
        className="flex flex-col items-center pt-12"
      >
        <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
          <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
            基本資料
          </div>
          {isSimulatorDetails && (
            <div className="grid grid-cols-[auto_1fr] items-center">
              <span className="w-28">開啟大門</span>
              <IconShortButton
                className="flex justify-center"
                icon="plus"
                onClick={onOpenGate}
                disabled={isOpeningGate}
              >
                開啟
              </IconShortButton>
            </div>
          )}
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"code"}
            label="廠商編號"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"name"}
            label="廠商名稱"
          />
          <StoreFormSelectField
            disabled={isInputDisabled}
            form={form}
            name="category"
            label="類別"
          />
          <div className="flex sm:flex-col">
            <FormField
              control={form.control}
              name="openingHoursStart"
              render={({ field }) => (
                <FormItem className="grid grid-cols-[auto_auto] items-baseline gap-y-1 sm:grid-cols-1">
                  <FormLabel className="w-28">營業時間</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-48 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-full",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入起始營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled}
                      onClick={(e) => e.currentTarget.showPicker()}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("openingHoursStart");
                      }}
                    />
                  </FormControl>

                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openingHoursEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-48 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-full sm:p-1",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入結束營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled}
                      onClick={(e) => e.currentTarget.showPicker()}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("openingHoursEnd");
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex ">
            <FormField
              control={form.control}
              name="phoneAreaCode"
              render={({ field }) => (
                <FormItem className="grid grid-cols-[auto_auto] items-baseline gap-y-1 sm:gap-x-3">
                  <FormLabel className="w-28 sm:w-auto">市話</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-14 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-7",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`02`}
                      {...field}
                      disabled={isInputDisabled}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("phoneAreaCode");
                      }}
                    />
                  </FormControl>

                  <FormMessage className="col-start-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="ml-4 flex flex-col gap-1">
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-80 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-[132px]",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`12345678`}
                      {...field}
                      disabled={isInputDisabled}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("phone");
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"contact"}
            label="聯絡人"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"contactPhone"}
            label="聯絡電話"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"latitude"}
            label="緯度"
            asNumber
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"longitude"}
            label="經度"
            asNumber
          />
          <StoreFormAddressSelectFields
            form={form}
            names={["county", "district", "address"]}
            label="地址"
            counties={counties}
            districts={districts}
            disabled={isInputDisabled}
          />

          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"merchantId"}
            label="MerchantId"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"hashKey"}
            label="HashKey"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"hashIV"}
            label="HashIV"
          />
        </section>
        <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
          <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
            系統管理
          </div>

          {form.watch("employees").map((employee, idx) => (
            <div
              className="grid grid-cols-[auto_1fr] sm:hidden"
              key={employee.id}
            >
              <div className="w-28">{idx === 0 && "系統管理者"}</div>

              <div
                className={cn(
                  "flex flex-1 items-center border-b border-orange pb-1 pl-1",
                  isInputDisabled && "opacity-50",
                )}
              >
                {employee.chName} <span className="text-word-gray">/</span>{" "}
                {employee.telphone}
                <button
                  className="ml-auto mr-1"
                  onClick={() =>
                    form.setValue(
                      "employees",
                      form
                        .getValues("employees")
                        .filter((e) => e.id !== employee.id),
                    )
                  }
                  disabled={isInputDisabled}
                >
                  <img src={redMinusIcon} />
                </button>
              </div>
            </div>
          ))}
          <div className="hidden w-28 sm:block">系統管理者</div>
          {form.watch("employees").map((employee) => {
            return (
              <div
                className={cn(
                  "hidden flex-1 items-center border-b border-orange pb-1 pl-1 sm:flex",
                  isInputDisabled && "opacity-50",
                )}
              >
                {employee.chName} <span className="text-word-gray">/</span>{" "}
                {employee.telphone}
                <button
                  className="ml-auto mr-1"
                  onClick={() =>
                    form.setValue(
                      "employees",
                      form
                        .getValues("employees")
                        .filter((e) => e.id !== employee.id),
                    )
                  }
                  disabled={isInputDisabled}
                >
                  <img src={redMinusIcon} />
                </button>
              </div>
            );
          })}

          <div className="grid grid-cols-[auto_1fr] ">
            <div className="w-28 sm:hidden">
              {form.watch("employees").length === 0 && "系統管理者"}
            </div>

            <AddEmployeeAsStoreManagerModal
              dialogTriggerChildren={
                <button
                  className={cn(
                    "flex items-center border-b border-line-gray pb-1 pl-1 sm:col-start-2",
                    isInputDisabled && "cursor-not-allowed opacity-50",
                  )}
                  disabled={isInputDisabled}
                >
                  <div className="ml-auto mr-1">
                    <img src={greenPlusIcon} />
                  </div>
                </button>
              }
              employees={employees}
              onConfirm={(selectedEmployees: Employee[]) => {
                form.setValue("employees", selectedEmployees, {
                  shouldDirty: true,
                });
              }}
              selectedEmployees={form.getValues("employees")}
              setRowSelection={(
                rowSelection: SetStateAction<Record<string, boolean>>,
              ) => {
                form.setValue(
                  "employees",
                  employees.filter((e) =>
                    Object.keys(
                      typeof rowSelection === "function"
                        ? rowSelection(
                            form.getValues("employees").reduce(
                              (acc, curr) => {
                                acc[curr.id] = true;
                                return acc;
                              },
                              {} as Record<string, boolean>,
                            ),
                          )
                        : rowSelection,
                    ).includes(e.id),
                  ),
                );
              }}
            />
          </div>
        </section>
      </form>
    </Form>
  );
}
