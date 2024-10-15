import { MainLayout } from "@/layouts/main-layout";

import { loader } from "@/pages/store-management/new/loader";
import { storeCategories } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";

import { countyQuery, generateDistrictQuery } from "@/api/county-district";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { NewStoreDesktopMenubar } from "@/pages/store-management/components/new-store-desktop-menubar";
import { NewStoreMobileMenubar } from "@/pages/store-management/components/new-store-mobile-menubar";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { StoreForm } from "../components/store-form";
import { formSchema } from "../schemas";

export function Component() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      LineLink: "",
      IGLink: "",
      chargeImages: undefined,
      merchantId: "",
      hashKey: "",
      linepayChannelId: "",
      linepayChannelSecret: "",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      ...(values.LineLink ? { LineLink: values.LineLink } : {}),
      ...(values.IGLink ? { IGLink: values.IGLink } : {}),
      ...(values.merchantId ? { merchantId: values.merchantId } : {}),
      ...(values.hashKey ? { hashKey: values.hashKey } : {}),
      ...(values.hashIV ? { hashIV: values.hashIV } : {}),
      ...(values.linepayChannelId
        ? { linepayChannelId: values.linepayChannelId }
        : {}),
      ...(values.linepayChannelSecret
        ? { linepayChannelSecret: values.linepayChannelSecret }
        : {}),
      ...(values.invoiceMerchantId
        ? { invoiceMerchantId: values.invoiceMerchantId }
        : {}),
      ...(values.invoiceHashKey
        ? { invoiceHashKey: values.invoiceHashKey }
        : {}),
      ...(values.invoiceHashIV ? { invoiceHashIV: values.invoiceHashIV } : {}),
    };

    setIsMutating(true);

    //  submit(transformedValues, {
    //   method: "post",
    //   action: pathname,
    //   encType: "application/json",
    // });

    const response = await privateFetch("/store", {
      method: "POST",
      body: JSON.stringify(transformedValues),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast.error("新增廠商失敗");

      return setIsMutating(false);
    }

    const storeId = (await response.json()).id;

    if (values.chargeImages) {
      const formData = new FormData();
      formData.append("image", (values.chargeImages as FileList).item(0)!);
      await privateFetch(`/store/${storeId}/upload-charge-image`, {
        method: "POST",
        body: formData,
      });
    }

    toast.success("新增廠商成功");
    queryClient.invalidateQueries({ queryKey: ["stores"] });

    navigate(linksKV["store-management"].paths.index);
  }

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
