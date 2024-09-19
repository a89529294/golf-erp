import { MainLayout } from "@/layouts/main-layout";

import { loader } from "@/pages/store-management/new/loader";
import { storeCategories } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";

import { countyQuery, generateDistrictQuery } from "@/api/county-district";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { NewStoreDesktopMenubar } from "@/pages/store-management/components/new-store-desktop-menubar";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { StoreForm } from "../components/store-form";
import { formSchema } from "../schemas";
import { NewStoreMobileMenubar } from "@/pages/store-management/components/new-store-mobile-menubar";

export function Component() {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: employees } = useQuery({
    ...genEmployeesQuery("employees-with-no-store"),
    initialData: initialData[1],
  });
  const { data: counties } = useQuery({
    ...countyQuery,
    initialData: initialData[0],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      category: storeCategories[0],
      openingHoursStart: "",
      openingHoursEnd: "",
      phoneAreaCode: "",
      phone: "",
      contact: "",
      contactPhone: "",
      latitude: "",
      longitude: "",
      county: "",
      district: "",
      address: "",
      employees: [],
      merchantId: "",
      hashKey: "",
      hashIV: "",
      invoiceMerchantId: "",
      invoiceHashKey: "",
      invoiceHashIV: "",
    },
  });
  const currentCounty = form.watch("county");
  const { data: districts } = useQuery({
    ...generateDistrictQuery(currentCounty),
    enabled: !!currentCounty,
  });

  const [isMutating, setIsMutating] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const transformedValues = {
      code: values.code,
      name: values.name,
      category: values.category,
      businessHours: `${values.openingHoursStart}-${values.openingHoursEnd}`,
      telphone: `${values.phoneAreaCode}-${values.phone}`,
      contact: values.contact,
      contactPhone: values.contactPhone,
      latitude: values.latitude,
      longitude: values.longitude,
      county:
        counties.find((c) => c.countycode === values.county)?.countyname ?? "",
      district: values.district,
      address: values.address,
      employeeIds: values.employees.map((e) => e.id),
      ...(values.merchantId ? { merchantId: values.merchantId } : {}),
      ...(values.hashKey ? { hashKey: values.hashKey } : {}),
      ...(values.hashIV ? { hashIV: values.hashIV } : {}),
      ...(values.invoiceMerchantId
        ? { invoiceMerchantId: values.invoiceMerchantId }
        : {}),
      ...(values.invoiceHashKey
        ? { invoiceHashKey: values.invoiceHashKey }
        : {}),
      ...(values.invoiceHashIV ? { invoiceHashIV: values.invoiceHashIV } : {}),
    };

    setIsMutating(true);
    submit(transformedValues, {
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
        isMobile ? (
          <NewStoreMobileMenubar
            isDirty={form.formState.isDirty}
            isMutating={isMutating}
            onSubmit={async () => {
              const success = await form.trigger();
              if (success) onSubmit(form.getValues());
            }}
          />
        ) : (
          <NewStoreDesktopMenubar
            isMutating={isMutating}
            isDirty={form.formState.isDirty}
          />
        )
      }
    >
      <div className="mb-2.5 w-full border border-line-gray p-1">
        <div className="bg-light-gray py-2.5  text-center">建立廠商資料</div>
        <StoreForm
          counties={counties}
          districts={districts}
          employees={employees}
          form={form}
          isMutating={isMutating}
          onSubmit={onSubmit}
        />
      </div>
    </MainLayout>
  );
}
