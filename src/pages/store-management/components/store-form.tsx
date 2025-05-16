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
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
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
// import { IconShortButton } from "@/components/ui/button";
// import { useParams } from "react-router-dom";
// import { privateFetch } from "@/utils/utils";
// import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChargeImageField } from "@/pages/store-management/components/charge-image-field";
import { TextButton } from "@/components/ui/button";

const DAYS_OF_WEEK_CONFIG = [
  { keyStr: "monday", label: "星期一", dayNumber: 1 },
  { keyStr: "tuesday", label: "星期二", dayNumber: 2 },
  { keyStr: "wednesday", label: "星期三", dayNumber: 3 },
  { keyStr: "thursday", label: "星期四", dayNumber: 4 },
  { keyStr: "friday", label: "星期五", dayNumber: 5 },
  { keyStr: "saturday", label: "星期六", dayNumber: 6 },
  { keyStr: "sunday", label: "星期日", dayNumber: 7 },
];

type FormValues = z.infer<typeof formSchema>;

type Paths<T, K extends keyof T = keyof T> = K extends string
  ? T[K] extends object
    ? `${K}.${Paths<T[K]>}`
    : K
  : never;

type FormFieldPaths = Paths<FormValues>;

type SpecialPlansPath =
  `specialPlans.${number}.timeRanges.${number}.${"startTime" | "endTime" | "discount"}`;

export function StoreForm({
  form,
  onSubmit,
  isMutating,
  counties,
  districts,
  employees,
  disabled,
  disableCode,
  setChargeImageId,
}: {
  form: UseFormReturn<FormValues>;
  setChargeImageId?: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (values: FormValues) => void;
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
  disableCode?: boolean;
}) {
  const [fullHoursChecked, setFullHoursChecked] = useState<
    boolean | "indeterminate"
  >(false);
  const [eInvoiceChecked, setEInvoiceChecked] = useState<
    boolean | "indeterminate"
  >(
    !!(
      form.getValues("invoiceMerchantId") ||
      form.getValues("invoiceHashIV") ||
      form.getValues("invoiceHashKey")
    ),
  );

  const isInputDisabled = !!(isMutating || disabled);
  const { control, watch, setValue, getValues } = form;

  // Ensure specialPlans has 7 day objects initially
  // This could also be handled when setting form defaultValues
  // For now, let's assume defaultValues handles this or it's done in a useEffect if loading existing data
  // Example: if (!getValues("specialPlans") || getValues("specialPlans").length !== 7) {
  //   setValue("specialPlans", DAYS_OF_WEEK_CONFIG.map(day => ({ day: day.dayNumber, timeRanges: [] })), { shouldValidate: false });
  // }

  return (
    <Form {...form}>
      <form
        id="store-form"
        onSubmit={form.handleSubmit(onSubmit, (error, event) => {})}
        className="flex flex-col items-center pt-12"
      >
        <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
          <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
            基本資料
          </div>

          <StoreFormField
            disabled={isInputDisabled || !!disableCode}
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
            <FormLabel className="w-28">營業時間</FormLabel>
            <FormField
              control={form.control}
              name="openingHoursStart"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-1">
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-full rounded-none border-0 border-b border-b-secondary-dark p-1 focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-full",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入起始營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled || !!fullHoursChecked}
                      onClick={(e) => e.currentTarget.showPicker()}
                      onChange={(e) => {
                        field.onChange(e);
                        if (
                          form.getValues("openingHoursEnd") === "23:59" &&
                          e.target.value === "00:00"
                        )
                          setFullHoursChecked(true);
                        else setFullHoursChecked(false);
                        form.clearErrors("openingHoursStart");
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openingHoursEnd"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-1">
                  <FormControl>
                    <Input
                      className={cn(
                        "h-7 w-full rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange sm:w-full sm:p-1",
                        field.value && "border-b-orange",
                      )}
                      placeholder={`請輸入結束營業時間`}
                      type="time"
                      {...field}
                      disabled={isInputDisabled || !!fullHoursChecked}
                      onClick={(e) => e.currentTarget.showPicker()}
                      onChange={(e) => {
                        field.onChange(e);
                        if (
                          form.getValues("openingHoursStart") === "00:00" &&
                          e.target.value === "23:59"
                        )
                          setFullHoursChecked(true);
                        else setFullHoursChecked(false);
                        form.clearErrors("openingHoursEnd");
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Label className="flex items-center gap-2 sm:mt-2">
              24小時營業
              <Checkbox
                className="disabled:opacity-25"
                checked={fullHoursChecked}
                onCheckedChange={(e) => {
                  if (e === true) {
                    form.setValue("openingHoursStart", "00:00");
                    form.setValue("openingHoursEnd", "23:59");
                  }
                  setFullHoursChecked(e);
                }}
                disabled={isInputDisabled}
              />
            </Label>
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
            name={"LineLink"}
            label="Line連結"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"IGLink"}
            label="IG連結"
          />

          <ChargeImageField
            form={form}
            disabled={isInputDisabled}
            setChargeImageId={setChargeImageId}
          />

          {/* <div className="col-span-1 my-6 space-y-2 md:col-span-2">
            <div>早鳥優惠設定</div>
            {DAYS_OF_WEEK_CONFIG.map((dayConfig, dayIndex) => {
              const {
                fields: timeRangeFields,
                append: appendTimeRange,
                remove: removeTimeRange,
              } = useFieldArray({
                control: form.control,
                name: `specialPlans.${dayIndex}.timeRanges` as const,
              });

              return (
                <div
                  key={dayConfig.keyStr}
                  className=" rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-700">
                      {dayConfig.label}
                    </h4>
                    <Controller
                      name={`specialPlans.${dayIndex}.day`}
                      control={form.control}
                      defaultValue={dayConfig.dayNumber}
                      render={({ field }) => (
                        <input
                          type="hidden"
                          {...field}
                          value={field.value || dayConfig.dayNumber}
                        />
                      )}
                    />
                    <TextButton
                      type="button"
                      onClick={() => {
                        appendTimeRange({
                          startTime: "00:00:00",
                          endTime: "00:00:00",
                          discount: 0.1,
                        });
                        form.clearErrors(`specialPlans.${dayIndex}.timeRanges`);
                      }}
                      disabled={isInputDisabled}
                      className=""
                    >
                      新增時段
                    </TextButton>
                  </div>

                  {timeRangeFields.length === 0 && (
                    <p className="py-2 text-sm italic text-gray-500">
                      本日無特殊時段
                    </p>
                  )}

                  {timeRangeFields.map((timeRangeField, rangeIndex) => (
                    <div
                      key={timeRangeField.id}
                      className="mb-3 grid grid-cols-1 items-end gap-x-4 gap-y-2 border-t border-gray-100 p-3 pt-3 first:border-t-0 md:grid-cols-[1fr_1fr_1fr_auto]"
                    >
                      <FormField
                        control={form.control}
                        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.startTime`}
                        render={({ field, fieldState }) => {
                          const x = Object.keys(
                            // @ts-ignore
                            form.getFieldState("specialPlans").error?.[dayIndex]
                              ?.timeRanges ?? {},
                          )[0]?.split(",");

                          const hasError = !!x?.includes(rangeIndex.toString());

                          return (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-600">
                                開始時間
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  step="1"
                                  lang="en-GB"
                                  {...field}
                                  disabled={isInputDisabled}
                                  className={cn(
                                    "block h-9 w-full text-sm ",
                                    hasError && "border-red-500",
                                  )}
                                  placeholder="HH:MM:SS"
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    field.onChange(newValue);
                                    form.setValue(field.name, newValue, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                      shouldTouch: true,
                                    });
                                    form.clearErrors(field.name);
                                  }}
                                />
                              </FormControl>
                              {hasError && (
                                <div className="mt-1 text-xs text-red-500">
                                  結束時間必須晚於開始時間
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.endTime`}
                        render={({ field, fieldState }) => {
                          const x = Object.keys(
                            // @ts-ignore
                            form.getFieldState("specialPlans").error?.[dayIndex]
                              ?.timeRanges ?? {},
                          )[0]?.split(",");

                          const hasError = !!x?.includes(rangeIndex.toString());

                          return (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-gray-600">
                                結束時間
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  step="1"
                                  lang="en-GB"
                                  {...field}
                                  disabled={isInputDisabled}
                                  className={cn(
                                    "block h-9 w-full text-sm",
                                    hasError && "border-red-500",
                                  )}
                                  placeholder="HH:MM:SS"
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    field.onChange(newValue);
                                    form.setValue(field.name, newValue, {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                      shouldTouch: true,
                                    });
                                    form.clearErrors(field.name);
                                  }}
                                />
                              </FormControl>
                              {hasError && (
                                <div className="mt-1 text-xs text-red-500">
                                  結束時間必須晚於開始時間
                                </div>
                              )}
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name={`specialPlans.${dayIndex}.timeRanges.${rangeIndex}.discount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-gray-600">
                              折扣 (例: 0.9 為9折)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                {...field}
                                value={
                                  field.value === undefined
                                    ? ""
                                    : String(field.value)
                                } // Handle undefined for controlled input
                                onChange={(e) => {
                                  const val = e.target.value;
                                  let numVal: number | undefined;
                                  if (val === "") {
                                    numVal = undefined;
                                  } else {
                                    const parsed = parseFloat(val);
                                    if (!isNaN(parsed)) {
                                      numVal = Math.min(Math.max(parsed, 0), 1); // Clamp between 0 and 1
                                    } else {
                                      numVal = undefined;
                                    }
                                  }
                                  field.onChange(numVal);
                                  form.setValue(field.name, numVal, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                    shouldTouch: true,
                                  });
                                  form.clearErrors(field.name);
                                }}
                                disabled={isInputDisabled}
                                className="h-9 w-full text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <TextButton
                        onClick={() => removeTimeRange(rangeIndex)}
                        disabled={isInputDisabled}
                        className="mt-4 h-9 self-center justify-self-start md:mb-[2px] md:mt-0 md:self-end"
                      >
                        刪除
                      </TextButton>
                    </div>
                  ))}
                </div>
              );
            })}
          </div> */}

          <div>藍新金流設定</div>
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
          <div>LinePay 設定</div>
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"linepayChannelId"}
            label="ChannelId"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"linepayChannelSecret"}
            label="Secret"
          />
          <div>JKOPay 設定</div>
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"jkoApiKey"}
            label="jkoApiKey"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"jkoSercertKey"}
            label="jkoSecretKey"
          />
          <StoreFormField
            disabled={isInputDisabled}
            form={form}
            name={"jkoStoreId"}
            label="jkoStoreId"
          />
          <Label className="flex items-center sm:items-baseline sm:justify-between">
            <div className="space-y-1">
              <div className="w-28 sm:hidden">電子發票</div>
              <div className="w-28 sm:hidden">三個</div>
              <div className="hidden sm:block">電子發票三個</div>
            </div>

            <Checkbox
              className="disabled:opacity-25 "
              checked={eInvoiceChecked}
              onCheckedChange={(s) => {
                setEInvoiceChecked(s);
                if (!s) {
                  form.setValue("invoiceMerchantId", "", { shouldDirty: true });
                  form.setValue("invoiceHashKey", "", { shouldDirty: true });
                  form.setValue("invoiceHashIV", "", { shouldDirty: true });
                }
              }}
              disabled={isInputDisabled}
            />
          </Label>
          {eInvoiceChecked && (
            <>
              <StoreFormField
                labelClassName="w-40"
                disabled={isInputDisabled}
                form={form}
                name={"invoiceMerchantId"}
                label="InvoiceMerchantId"
              />
              <StoreFormField
                labelClassName="w-40"
                disabled={isInputDisabled}
                form={form}
                name={"invoiceHashKey"}
                label="InvoiceHashKey"
              />
              <StoreFormField
                labelClassName="w-40"
                disabled={isInputDisabled}
                form={form}
                name={"invoiceHashIV"}
                label="invoiceHashIV"
              />
            </>
          )}
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
                      {
                        shouldDirty: true,
                      },
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
                key={employee.id}
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
