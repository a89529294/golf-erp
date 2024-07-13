import { Form } from "@/components/ui/form";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { storesQuery } from "@/pages/store-management/loader";
import { EmployeeFormField } from "@/pages/system-management/personnel-management/components/employee-form-field";
import { EmployeeFormSelectField } from "@/pages/system-management/personnel-management/components/employee-form-select-field";
import { NewPersonnelDesktopMenubar } from "@/pages/system-management/personnel-management/components/new-personnel-desktop-menubar";
import { NewPersonnelMobileMenubar } from "@/pages/system-management/personnel-management/components/new-personnel-mobile-menubar";
import { loader } from "@/pages/system-management/personnel-management/new/loader";
import { storeCategories, storeCategoryMap } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
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

export function Component() {
  const isMobile = useIsMobile();
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
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
        isMobile ? (
          <NewPersonnelMobileMenubar
            isDirty={form.formState.isDirty}
            isMutating={isMutating}
            onSubmit={async () => {
              const success = await form.trigger();
              if (success) onSubmit(form.getValues());
            }}
          />
        ) : (
          <NewPersonnelDesktopMenubar
            isDirty={form.formState.isDirty}
            isMutating={isMutating}
          />
        )
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
                disabled={isMutating}
              />
              <EmployeeFormField
                form={form}
                name={"name"}
                label="姓名"
                disabled={isMutating}
              />
              <EmployeeFormField
                form={form}
                name={"phoneno"}
                label="電話"
                disabled={isMutating}
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
                disabled={isMutating}
              />
              <EmployeeFormSelectField
                form={form}
                name="storeId"
                label="店名"
                options={storeOptions}
                key={categorySelected}
                disabled={isMutating}
              />
            </section>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
