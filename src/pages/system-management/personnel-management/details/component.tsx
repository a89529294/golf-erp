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
import { loader } from "@/pages/system-management/personnel-management/details/loader";
import { storeCategories, storeCategoryMap } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
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
import { storesQuery } from "@/pages/store-management/loader";
import { genEmployeeQuery } from "@/pages/system-management/personnel-management/details/loader";

const toValueLabelArray = (obj: { name: string; id: string }[]) => {
  const options: Record<string, string> = {};
  obj.forEach((s) => (options[s.id] = s.name));
  return options;
};

const formSchema = z.object({
  idNumber: z.string().min(1, { message: "請填入編號" }),
  name: z.string().min(1, { message: "請填入姓名" }),
  phoneno: z.string().min(1, { message: "請填入電話" }),
  category: z.enum(storeCategories),
  storeId: z.union([z.string(), z.undefined()]),
});

export function Component() {
  const [disabled, setDisabled] = useState(true);
  const submit = useSubmit();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...storesQuery,
    initialData: initialData[1],
  });
  const { data: employee } = useQuery({
    ...genEmployeeQuery(id!),
    initialData: initialData[0],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: employee.idNumber,
      name: employee.chName,
      phoneno: employee.telphone,
      category: employee.stores?.[0].category ?? storeCategories[0],
      storeId: employee.stores?.[0].id,
    },
  });
  const [storeOptions, setStoreOptions] = useState(() => {
    return toValueLabelArray(stores.golf);
  });
  const [isMutating, setIsMutating] = useState(false);

  const categorySelected = useWatch({
    control: form.control,
    name: "category",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsMutating(true);
    submit(values, {
      method: "post",
      action: pathname,
      encType: "application/json",
    });
  }

  useEffect(() => {
    if (categorySelected === "golf")
      setStoreOptions(toValueLabelArray(stores.golf));
    if (categorySelected === "ground")
      setStoreOptions(toValueLabelArray(stores.ground));
    if (categorySelected === "simulator")
      setStoreOptions(toValueLabelArray(stores.simulator));
    form.resetField("storeId");
  }, [categorySelected, stores, form]);

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
              title="資料尚未儲存，是否返回？"
            />
          ) : disabled ? (
            <IconButton
              disabled={isMutating}
              icon="back"
              onClick={() => navigate(-1)}
            >
              返回
            </IconButton>
          ) : (
            <IconButton icon="back" onClick={() => setDisabled(true)}>
              返回
            </IconButton>
          )}
          {disabled ? (
            <IconButton
              type="button"
              icon="pencil"
              onClick={(e) => setDisabled(false)}
              key="edit-btn"
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              disabled={isMutating}
              icon="save"
              form="new-employee-form"
              key="save-btn"
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <div className="mb-2.5 w-full border border-line-gray p-1">
        <div className="bg-light-gray py-2.5  text-center">建立人員資料</div>
        <Form {...form}>
          <form
            id="new-employee-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center pt-12"
          >
            <section className="flex w-fit flex-col gap-6 border border-line-gray px-16 pb-10">
              <div className="-mx-16 mb-4 bg-light-gray py-1.5 text-center text-black">
                基本資料
              </div>
              <EmployeeFormField
                form={form}
                name={"idNumber"}
                label="編號"
                isMutating={isMutating}
                disabled={disabled}
              />
              <EmployeeFormField
                form={form}
                name={"name"}
                label="姓名"
                isMutating={isMutating}
                disabled={disabled}
              />
              <EmployeeFormField
                form={form}
                name={"phoneno"}
                label="電話"
                isMutating={isMutating}
                disabled={disabled}
              />
            </section>
            <section className="flex w-fit flex-col gap-6 border border-line-gray px-16 pb-10">
              <div className="-mx-16 bg-light-gray py-1.5 text-center text-black">
                綁定廠商
              </div>
              <EmployeeFormSelectField
                form={form}
                name="category"
                label="類別"
                options={storeCategoryMap}
                isMutating={isMutating}
              />
              <EmployeeFormSelectField
                form={form}
                name="storeId"
                label="店名"
                options={storeOptions}
                key={categorySelected}
                isMutating={isMutating}
              />
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}

function EmployeeFormField({
  form,
  name,
  label,
  isMutating,
  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  isMutating: boolean;
  disabled: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-7">
            <FormLabel required>{label}</FormLabel>
            <FormControl>
              <Input
                className={cn(
                  "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
                  field.value && "border-b-orange",
                )}
                placeholder={`請輸入${label}`}
                {...field}
                disabled={isMutating || disabled}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function EmployeeFormSelectField({
  form,
  name,
  label,
  options,
  isMutating,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  options: Record<string, string>;
  isMutating: boolean;
}) {
  const [selectKey, setSelectKey] = useState(0);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-7">
            <FormLabel>{label}</FormLabel>
            <Select
              disabled={isMutating}
              onValueChange={(v) => {
                if (v === "reset") {
                  setSelectKey(selectKey + 1);
                  field.onChange(undefined);
                } else {
                  field.onChange(v);
                }
              }}
              defaultValue={field.value}
              key={selectKey}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus:border-b-[1.5px] focus:border-b-orange",
                    field.value && "border-b-orange",
                  )}
                >
                  {/* <SelectValue placeholder={`選擇${label}`} /> */}
                  <SelectValue placeholder={`選擇${label}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="reset">清空</SelectItem>
                {Object.entries(options).map(([value, label]) => (
                  <SelectItem value={value} key={value}>
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
