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

import { Modal } from "@/components/modal";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { storesQuery } from "@/pages/store-management/loader";
import {
  genEmployeeQuery,
  loader,
} from "@/pages/system-management/personnel-management/details/loader";
import { StoreCategory, storeCategories, storeCategoryMap } from "@/utils";
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

// TODO fix flickering when selecting clear store option
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
      category: employee.stores?.[0]?.category ?? storeCategories[0],
      storeId: employee.stores?.[0]?.id,
    },
  });
  const [storeOptions, setStoreOptions] = useState(() => {
    return toValueLabelArray(
      stores[employee.stores?.[0]?.category ?? storeCategories[0]],
    );
  });
  const [isMutating, setIsMutating] = useState(false);

  const categorySelected = useWatch({
    control: form.control,
    name: "category",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const changedValues: Record<string, string | null> = {};

    for (const k in form.formState.dirtyFields) {
      const key = k as keyof typeof values;
      if (key === "category") continue;
      else if (key === "phoneno") changedValues["telphone"] = values["phoneno"];
      else if (key === "name") changedValues["chName"] = values["name"];
      else if (values["storeId"] === "") changedValues["storeId"] = null;
      else changedValues[key] = values[key] ?? null;
    }

    setIsMutating(true);
    submit(changedValues, {
      method: "post",
      action: pathname,
      encType: "application/json",
    });
  }

  // useEffect(() => {
  //   if (isMount) return;
  //   if (categorySelected === "golf")
  //     setStoreOptions(toValueLabelArray(stores.golf));
  //   if (categorySelected === "ground")
  //     setStoreOptions(toValueLabelArray(stores.ground));
  //   if (categorySelected === "simulator")
  //     setStoreOptions(toValueLabelArray(stores.simulator));
  //   form.setValue("storeId", "", { shouldDirty: true });
  // }, [categorySelected, stores, form, isMount]);

  useEffect(() => {
    if (searchParams.get("error")) {
      setIsMutating(false);
      setSearchParams("");
    }
  }, [searchParams, setSearchParams]);

  const dirtyFields = form.formState.dirtyFields;
  const isBasicInfoDirty =
    dirtyFields.idNumber || dirtyFields.name || dirtyFields.phoneno;
  const isCategoryStoreDirty = dirtyFields.storeId;

  console.log(dirtyFields);

  return (
    <MainLayout
      headerChildren={
        <>
          {isBasicInfoDirty || isCategoryStoreDirty ? (
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
              onClick={(e) => {
                // necessary to prevent the save button from firing
                e.nativeEvent.stopImmediatePropagation();
                setTimeout(() => {
                  setDisabled(false);
                }, 0);
              }}
              // key="edit-btn"
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              disabled={
                isMutating || !(isBasicInfoDirty || isCategoryStoreDirty)
              }
              icon="save"
              form="new-employee-form"
              // key="save-btn"
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
                disabled={disabled || isMutating}
              />
              <EmployeeFormField
                form={form}
                name={"name"}
                label="姓名"
                disabled={disabled || isMutating}
              />
              <EmployeeFormField
                form={form}
                name={"phoneno"}
                label="電話"
                disabled={disabled || isMutating}
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
                disabled={isMutating || disabled}
                onChange={(newCategory: string) => {
                  setStoreOptions(
                    toValueLabelArray(stores[newCategory as StoreCategory]),
                  );
                  form.setValue("storeId", "", { shouldDirty: true });
                }}
              />
              <EmployeeFormSelectField
                form={form}
                name="storeId"
                label="店名"
                options={{
                  reset: "清空",
                  ...storeOptions,
                }}
                key={categorySelected}
                disabled={isMutating || disabled}
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

  disabled,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;

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
                disabled={disabled}
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
  disabled,
  onChange,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  options: Record<string, string>;
  disabled: boolean;
  onChange?: (v: string) => void;
}) {
  // const [selectKey, setSelectKey] = useState(0);

  if (name === "storeId") console.log(form.getValues("storeId"));

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-7">
            <FormLabel>{label}</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={(v) => {
                if (v === "reset") {
                  // setSelectKey(selectKey + 1);
                  field.onChange("");
                  onChange && onChange("");
                } else {
                  field.onChange(v);
                  onChange && onChange(v);
                }
              }}
              defaultValue={field.value}
              // key={selectKey}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus:border-b-[1.5px] focus:border-b-orange",
                    field.value && "border-b-orange",
                  )}
                >
                  <SelectValue placeholder={`選擇${label}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
