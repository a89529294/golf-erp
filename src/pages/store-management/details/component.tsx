import { IconButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { storeCategories, storeCategoryMap } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import { Modal } from "@/components/modal";
import { useQuery } from "@tanstack/react-query";
import { loader } from "@/pages/store-management/details/loader";
import {
  countyQuery,
  generateDistrictQuery,
} from "@/pages/store-management/new/loader";
import redMinusIcon from "@/assets/red-minus-icon.svg";
import greenPlusIcon from "@/assets/green-plus-icon.svg";

import {
  Employee,
  employeeSchema,
  genEmployeesQuery,
} from "@/pages/system-management/personnel-management/loader";
import { AddEmployeeAsStoreManagerModal } from "@/components/select-employees-modal/add-employee-as-store-manager";
import { genStoreQuery } from "./loader";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "請輸入廠商名稱" }),
    category: z.enum(storeCategories),
    openingHoursStart: z.string().min(1, { message: "請輸入營業時間" }),
    openingHoursEnd: z.string().min(1, { message: "請輸入營業時間" }),
    phoneAreaCode: z.string().length(2, { message: "請填入區域碼" }),
    phone: z.string().min(1, { message: "請填入電話" }),
    contact: z.string().min(1, { message: "請填入聯絡人姓名" }),
    contactPhone: z.string().min(1, { message: "請填入聯絡人電話" }),
    county: z.string().min(1, { message: "請選擇縣市" }),
    district: z.string().min(1, { message: "請選擇地區" }),
    address: z.string().min(1, { message: "請填入地址" }),
    employees: z.array(employeeSchema),
  })
  .refine(
    (schema) => {
      return schema.openingHoursEnd > schema.openingHoursStart;
    },
    {
      message: "確保結束時間晚於開始時間",
      path: ["openingHoursEnd"],
    },
  );

export function Component() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [disabled, setDisabled] = useState(true);
  const { storeId } = useParams();
  const initialData = useLoaderData() as Exclude<
    Awaited<ReturnType<typeof loader>>,
    Response | undefined
  >;
  const { data: counties } = useQuery({
    ...countyQuery,
    initialData: initialData[0],
  });
  const { data: employees } = useQuery({
    ...genEmployeesQuery(),
    initialData: initialData[1],
  });

  const { data: store } = useQuery({
    ...genStoreQuery(storeId ?? ""),
    initialData: initialData[2],
    enabled: !!storeId,
  });

  const currentCountyName = store.county;
  const currentCountyCode = counties.find(
    (c) => c.countyname === currentCountyName,
  )?.countycode;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
      category: store.category,
      openingHoursStart: store.businessHours.split("-")[0],
      openingHoursEnd: store.businessHours.split("-")[1],
      phoneAreaCode: store.telphone.split("-")[0],
      phone: store.telphone.split("-")[1],
      contact: store.contact,
      contactPhone: store.contactPhone,
      county: currentCountyCode,
      district: store.district,
      address: store.address,
      employees: employees.filter((e) =>
        store.employees.map((se) => se.id).includes(e.id),
      ),
    },
  });

  const { data: districts } = useQuery({
    ...generateDistrictQuery(currentCountyCode ?? ""),
    enabled: !!currentCountyCode,
  });
  const [isMutating, setIsMutating] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const dirtyFields = form.formState.dirtyFields;

    const transformedValues = {
      name: values.name,
      category: values.category,
      businessHours: `${values.openingHoursStart}-${values.openingHoursEnd}`,
      telphone: `${values.phoneAreaCode} ${values.phone}`,
      contact: values.contact,
      contactPhone: values.contactPhone,
      county:
        counties.find((c) => c.countycode === values.county)?.countyname ?? "",
      district: values.district,
      address: values.address,
      employeeIds: values.employees.map((e) => e.id),
    };

    const changedFields: Partial<typeof transformedValues> = {};
    if (dirtyFields.name) changedFields.name = transformedValues.name;
    if (dirtyFields.category)
      changedFields.category = transformedValues.category;
    if (dirtyFields.openingHoursStart || dirtyFields.openingHoursEnd)
      changedFields.businessHours = transformedValues.businessHours;
    if (dirtyFields.phoneAreaCode || dirtyFields.phone)
      changedFields.telphone = transformedValues.telphone;
    if (dirtyFields.contact) changedFields.contact = transformedValues.contact;
    if (dirtyFields.contactPhone)
      changedFields.contactPhone = transformedValues.contactPhone;
    if (dirtyFields.county) changedFields.county = transformedValues.county;
    if (dirtyFields.district)
      changedFields.district = transformedValues.district;
    if (dirtyFields.address) changedFields.address = transformedValues.address;
    if (dirtyFields.employees)
      changedFields.employeeIds = transformedValues.employeeIds;

    // console.log(transformedValues);
    setIsMutating(true);
    submit(
      {
        ...changedFields,
        storeId: storeId as string,
      },
      {
        method: "post",
        action: pathname,
        encType: "application/json",
      },
    );
  }

  useEffect(() => {
    if (searchParams.get("error")) {
      setIsMutating(false);
      setSearchParams("");
    }
  }, [searchParams, setSearchParams]);

  return (
    <MainLayout
      headerChildren={
        <>
          {form.formState.isDirty ? (
            <Modal
              dialogTriggerChildren={
                <IconButton disabled={isMutating} icon="back">
                  返回
                </IconButton>
              }
              onSubmit={() => navigate(-1)}
              title="資料尚未儲存，是否返回列表？"
            />
          ) : (
            <IconButton
              disabled={isMutating}
              icon="back"
              onClick={() => setDisabled(true)}
            >
              返回
            </IconButton>
          )}
          {disabled ? (
            <IconButton
              icon="save"
              type="button"
              onClick={() => {
                setDisabled(false);
              }}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              disabled={isMutating || !form.formState.isDirty}
              icon="save"
              form="edit-store-form"
              type="submit"
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <div className="mb-2.5 w-full border border-line-gray p-1 ">
        <div className="bg-light-gray py-2.5  text-center">建立人員資料</div>
        <Form {...form}>
          <form
            id="edit-store-form"
            onSubmit={form.handleSubmit(onSubmit, (error, event) => {
              console.log(error, event);
            })}
            className="flex flex-col items-center pt-12"
          >
            <section className="flex w-fit flex-col gap-6 border border-line-gray px-12 pb-10">
              <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                基本資料
              </div>
              <StoreFormField
                disabled={!!disabled}
                form={form}
                name={"name"}
                label="廠商名稱"
              />
              <StoreFormSelectField
                disabled={!!disabled}
                form={form}
                name="category"
                label="類別"
              />
              <div className="flex">
                <FormField
                  disabled={!!disabled}
                  control={form.control}
                  name="openingHoursStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-5">
                        <FormLabel className="w-16">營業時間</FormLabel>
                        <FormControl>
                          <Input
                            className={cn(
                              "h-7 w-48 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                              field.value && "border-b-orange",
                            )}
                            placeholder={`請輸入起始營業時間`}
                            type="time"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={!!disabled}
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
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex">
                <FormField
                  disabled={!!disabled}
                  control={form.control}
                  name="phoneAreaCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-5">
                        <FormLabel className="w-16">市話</FormLabel>
                        <FormControl>
                          <Input
                            className={cn(
                              "h-7 w-12 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                              field.value && "border-b-orange",
                            )}
                            placeholder={`02`}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={!!disabled}
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="ml-4 flex flex-col gap-1">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-7 w-80 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                            field.value && "border-b-orange",
                          )}
                          placeholder={`12345678`}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <StoreFormField
                disabled={!!disabled}
                form={form}
                name={"contact"}
                label="聯絡人"
              />
              <StoreFormField
                disabled={!!disabled}
                form={form}
                name={"contactPhone"}
                label="聯絡電話"
              />
              <StoreFormAddressSelectFields
                form={form}
                names={["county", "district", "address"]}
                label="地址"
                counties={counties}
                districts={districts}
                disabled={!!disabled}
              />
            </section>
            <section className=" flex w-fit flex-col gap-6 border border-line-gray px-12 pb-10">
              <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                系統管理
              </div>

              {form.watch("employees").map((employee, idx) => (
                <div className="flex w-[468px] gap-5" key={employee.id}>
                  <div className="w-20">{idx === 0 && "系統管理者"}</div>

                  <div
                    className={cn(
                      "flex flex-1 items-center border-b border-orange pb-1 pl-1",
                      disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    {employee.chName} <span className="text-word-gray">/</span>{" "}
                    {employee.telphone}
                    {!disabled && (
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
                      >
                        <img src={redMinusIcon} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex w-[468px] gap-5">
                <div className="w-20 ">
                  {form.watch("employees").length === 0 && "系統管理者"}
                </div>

                {!disabled && (
                  <AddEmployeeAsStoreManagerModal
                    dialogTriggerChildren={
                      <button className="flex flex-1 items-center border-b border-line-gray pb-1 pl-1">
                        <div className="ml-auto mr-1">
                          <img src={greenPlusIcon} />
                        </div>
                      </button>
                    }
                    employees={employees}
                    onConfirm={(selectedEmployees: Employee[]) => {
                      form.setValue("employees", selectedEmployees);
                    }}
                  />
                )}
              </div>
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}

function StoreFormField({
  form,
  name,
  label,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: Exclude<keyof z.infer<typeof formSchema>, "employees">;
  label: string;
  disabled: boolean;
}) {
  return (
    <FormField
      disabled={disabled}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-5">
            <FormLabel className="w-16">{label}</FormLabel>
            <FormControl>
              <Input
                className={cn(
                  "h-7 w-96 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                  field.value && "border-b-orange",
                )}
                placeholder={`請輸入${label}`}
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StoreFormSelectField({
  form,
  name,
  label,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: Exclude<keyof z.infer<typeof formSchema>, "employees">;
  label: string;
  disabled: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-5">
            <FormLabel className="w-16">{label}</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "w-96 rounded-none border-0 border-b border-b-secondary-dark pb-1",
                    field.value && "border-b-orange",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(storeCategoryMap).map(([key, label]) => (
                  <SelectItem value={key} key={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StoreFormAddressSelectFields({
  form,
  names,
  label,
  counties,
  districts,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  names: [
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
    Exclude<keyof z.infer<typeof formSchema>, "employees">,
  ];
  label: string;
  counties: { countyname: string; countycode: string }[];
  districts: { townname: string }[] | undefined;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-[270px_186px] gap-3">
      <FormField
        control={form.control}
        name={names[0]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-baseline gap-5">
              <FormLabel className="w-16">{label}</FormLabel>
              <Select
                disabled={disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-[186px] rounded-none border-0 border-b border-b-secondary-dark pb-1",
                      field.value && "border-b-orange",
                    )}
                  >
                    <SelectValue placeholder="選擇縣市" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {counties.map(({ countycode, countyname }) => (
                    <SelectItem value={countycode} key={countycode}>
                      {countyname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={names[1]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1">
            <div className="flex items-baseline gap-5">
              <Select
                disabled={disabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-[186px] rounded-none border-0 border-b border-b-secondary-dark pb-1",
                      field.value && "border-b-orange",
                    )}
                  >
                    <SelectValue
                      placeholder={
                        form.getValues("county") ? "選擇鄉鎮" : "先選擇縣市"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {districts?.map(({ townname }) => (
                    <SelectItem value={townname} key={townname}>
                      {townname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        disabled={disabled}
        control={form.control}
        name={names[2]}
        render={({ field }) => (
          <FormItem className="flex flex-col gap-1 justify-self-end">
            <div className="flex items-baseline gap-5">
              <FormControl>
                <Input
                  className={cn(
                    "h-7 w-[186px] rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                    field.value && "border-b-orange",
                  )}
                  placeholder={`請輸入${label}`}
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
