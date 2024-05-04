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
  // useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";
import { Modal } from "@/components/modal";

const formSchema = z.object({
  name: z.string().min(1, { message: "請輸入廠商名稱" }),
  category: z.enum(storeCategories),
  openingHoursStart: z.string().min(1, { message: "請輸入開始時間" }),
  openingHoursEnd: z.string().min(1, { message: "請輸入關門時間" }),
  phoneAreaCode: z.string().min(1, { message: "請填入區域馬" }),
  phone: z.string().min(1, { message: "請填入電話" }),
  contact: z.string().min(1, { message: "請填入聯絡人姓名" }),
  contactPhone: z.string().min(1, { message: "請填入聯絡人電話" }),
  county: z.string().min(1, { message: "請選擇縣市" }),
  district: z.string().min(1, { message: "請選擇地區" }),
  address: z.string().min(1, { message: "請填入地址" }),
});

export function Component() {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  // const { data: stores } = useQuery({ ...storeQuery, initialData });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: storeCategories[0],
      openingHoursStart: "",
      openingHoursEnd: "",
      phoneAreaCode: "",
      phone: "",
      contact: "",
      contactPhone: "",
      county: "",
      district: "",
      address: "",
    },
  });

  const [isMutating, setIsMutating] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsMutating(true);
    submit(values, {
      method: "post",
      action: pathname,
      encType: "application/json",
    });
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
              <StoreFormField form={form} name={"name"} label="廠商名稱" />
              <StoreFormSelectField form={form} name="category" label="類別" />
            </section>
            {/* <section className="flex w-fit flex-col gap-6 border border-line-gray px-16 pb-10">
              <div className="-mx-16 bg-light-gray py-1.5 text-center text-black">
                綁定廠商
              </div>
            </section> */}
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
          <div className="flex items-baseline gap-5">
            <FormLabel className="w-16">{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-96 rounded-none border-0 border-b border-b-secondary-dark pb-1">
                  <SelectValue placeholder="Select a verified email to display" />
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
