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
import { loader } from "@/pages/system-management/personnel-management/new-employee/loader";
import { storeCategories, storeCategoryMap } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UseFormReturn, useForm, useWatch } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import { Modal } from "@/components/modal";
import { storesQuery } from "@/pages/store-management/loader";

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
  storeId: z.union([z.string(), z.undefined()]).refine((v) => v, {
    message: "請選擇店家",
  }),
});

export function Component() {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({ ...storesQuery, initialData });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      name: "",
      phoneno: "",
      category: storeCategories[0],
      storeId: undefined,
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
              title="資料尚未儲存，是否返回列表？"
            />
          ) : (
            <IconButton
              disabled={isMutating}
              icon="back"
              onClick={() => navigate(-1)}
            >
              返回
            </IconButton>
          )}
          <IconButton
            disabled={isMutating}
            icon="save"
            form="new-employee-form"
          >
            儲存
          </IconButton>
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
              <EmployeeFormField form={form} name={"idNumber"} label="編號" />
              <EmployeeFormField form={form} name={"name"} label="姓名" />
              <EmployeeFormField form={form} name={"phoneno"} label="電話" />
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
              />
              <EmployeeFormSelectField
                form={form}
                name="storeId"
                label="店名"
                options={storeOptions}
                key={categorySelected}
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
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-7">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                className={cn(
                  "h-7 w-60 rounded-none border-0 border-b border-b-secondary-dark focus-visible:border-b-[1.5px] focus-visible:border-b-orange",
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

function EmployeeFormSelectField({
  form,
  name,
  label,
  options,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  options: Record<string, string>;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          <div className="flex items-baseline gap-7">
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
