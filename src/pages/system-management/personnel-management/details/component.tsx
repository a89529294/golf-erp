import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-is-mobile";

import { MainLayout } from "@/layouts/main-layout";
import { storesQuery } from "@/pages/store-management/loader";
import { DetailsDesktopMenubar } from "@/pages/system-management/personnel-management/components/details-desktop-menubar";
import { DetailsMobileMenubar } from "@/pages/system-management/personnel-management/components/details-mobile-menubar";
import { EmployeeFormField } from "@/pages/system-management/personnel-management/components/employee-form-field";
import { EmployeeFormSelectField } from "@/pages/system-management/personnel-management/components/employee-form-select-field";
import { formSchema } from "@/pages/system-management/personnel-management/components/schemas";
import {
  genEmployeeQuery,
  loader,
} from "@/pages/system-management/personnel-management/details/loader";
import {
  StoreCategory,
  storeCategories,
  storeCategoryMap,
  toValueLabelArray,
} from "@/utils";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// TODO fix flickering when selecting clear store option
export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
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
  const { mutateAsync: deleteEmployee } = useMutation({
    mutationKey: ["delete-employee"],
    mutationFn: async () => {
      await privateFetch(`/employees/${employee.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("成功刪除員工");
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
      navigate("/system-management/personnel-management");
    },
    onError: () => {
      toast.error("無法刪除員工");
    },
  });

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

  useEffect(() => {
    if (searchParams.get("error")) {
      setIsMutating(false);
      setSearchParams("");
    } else {
      setIsMutating(false);
      setSearchParams("");
      form.reset({
        idNumber: form.getValues("idNumber"),
        name: form.getValues("name"),
        phoneno: form.getValues("phoneno"),
        category: form.getValues("category") ?? storeCategories[0],
        storeId: form.getValues("storeId"),
      });
    }
  }, [searchParams, setSearchParams, form]);

  const dirtyFields = form.formState.dirtyFields;
  const isBasicInfoDirty =
    dirtyFields.idNumber || dirtyFields.name || dirtyFields.phoneno;
  const isCategoryStoreDirty = dirtyFields.storeId;

  return (
    <MainLayout
      headerChildren={
        !isMobile ? (
          <DetailsDesktopMenubar
            setDisabled={setDisabled}
            disabled={disabled}
            isBasicInfoDirty={isBasicInfoDirty}
            isCategoryStoreDirty={isCategoryStoreDirty}
            isMutating={isMutating}
            employeeName={employee.chName}
            onDeleteEmployee={deleteEmployee}
            onSubmit={() => {
              setDisabled(true);
              form.reset();
              setStoreOptions(
                toValueLabelArray(
                  stores[employee.stores?.[0]?.category ?? storeCategories[0]],
                ),
              );
            }}
          />
        ) : (
          <DetailsMobileMenubar
            setDisabled={setDisabled}
            disabled={disabled}
            isBasicInfoDirty={isBasicInfoDirty}
            isCategoryStoreDirty={isCategoryStoreDirty}
            isMutating={isMutating}
            employeeName={employee.chName}
            onDeleteEmployee={deleteEmployee}
            onSubmit={() => {
              setDisabled(true);
              form.reset();
              setStoreOptions(
                toValueLabelArray(
                  stores[employee.stores?.[0]?.category ?? storeCategories[0]],
                ),
              );
            }}
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
            <section className="flex flex-col gap-6 px-16 pb-10 border w-fit border-line-gray">
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
            <section className="flex flex-col gap-6 px-16 pb-10 border w-fit border-line-gray">
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
