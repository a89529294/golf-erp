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
import { StoreFormAddressSelectFields } from "./store-form-address-select-field";
import { StoreFormField } from "./store-form-field";
import { StoreFormSelectField } from "./store-form-select-field";

export function StoreForm({
  form,
  onSubmit,
  isMutating,
  counties,
  districts,
  employees,
  disabled,
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
}) {
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
        <section className="flex flex-col gap-6 px-12 pb-10 border w-fit border-line-gray">
          <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
            基本資料
          </div>
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
          <div className="flex">
            <FormField
              control={form.control}
              name="openingHoursStart"
              render={({ field }) => (
                <FormItem className="grid grid-cols-[auto_auto] items-baseline gap-y-1">
                  <FormLabel className="w-20">營業時間</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-48 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入起始營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled}
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
                        "h-7 w-48 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入結束營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex">
            <FormField
              control={form.control}
              name="phoneAreaCode"
              render={({ field }) => (
                <FormItem className="grid grid-cols-[auto_auto] items-baseline gap-y-1">
                  <FormLabel className="w-20">市話</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-14 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`02`}
                      {...field}
                      disabled={isInputDisabled}
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
                <FormItem className="flex flex-col gap-1 ml-4">
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-80 rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`12345678`}
                      {...field}
                      disabled={isInputDisabled}
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
        </section>
        <section className="flex flex-col gap-6 px-12 pb-10 border w-fit border-line-gray">
          <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
            系統管理
          </div>

          {form.watch("employees").map((employee, idx) => (
            <div className="flex w-[468px] gap-5" key={employee.id}>
              <div className="w-20">{idx === 0 && "系統管理者"}</div>

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

          <div className="flex w-[468px] gap-5">
            <div className="w-20 ">
              {form.watch("employees").length === 0 && "系統管理者"}
            </div>

            <AddEmployeeAsStoreManagerModal
              dialogTriggerChildren={
                <button
                  className={cn(
                    "flex flex-1 items-center border-b border-line-gray pb-1 pl-1",
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
            />
          </div>
        </section>
      </form>
    </Form>
  );
}
