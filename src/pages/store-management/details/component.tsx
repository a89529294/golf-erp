import { MainLayout } from "@/layouts/main-layout";
import { loader } from "@/pages/store-management/details/loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { countyQuery, generateDistrictQuery } from "@/api/county-district";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DetailsDesktopMenubar } from "@/pages/store-management/components/details-desktop-menubar";
import { DetailsMobileMenubar } from "@/pages/store-management/components/details-mobile-menubar";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { StoreForm } from "../components/store-form";
import { formSchema } from "../schemas";
import { genStoreQuery } from "./loader";

export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);
  const { storeId } = useParams();
  const [chargeImageId, setChargeImageId] = useState("");
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
  // const filteredEmployees = employees.filter((e) =>
  //   e.stores && e.stores[0] ? e.stores[0].id === storeId : true,
  // );

  const { data: store } = useQuery({
    ...genStoreQuery(storeId ?? ""),
    initialData: initialData[2],
  });

  const currentCountyName = store.county;
  const oldCountyCode = counties.find(
    (c) => c.countyname === currentCountyName,
  )?.countycode;

  const day1 = store.specialPlans.find((d) => d.day === 1);
  const day2 = store.specialPlans.find((d) => d.day === 2);
  const day3 = store.specialPlans.find((d) => d.day === 3);
  const day4 = store.specialPlans.find((d) => d.day === 4);
  const day5 = store.specialPlans.find((d) => d.day === 5);
  const day6 = store.specialPlans.find((d) => d.day === 6);
  const day7 = store.specialPlans.find((d) => d.day === 7);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: store.code,
      name: store.name,
      category: store.category,
      openingHoursStart: store.businessHours
        ? store.businessHours.split("-")[0]
        : "",
      openingHoursEnd: store.businessHours
        ? store.businessHours.split("-")[1]
        : "",
      phoneAreaCode: store.telphone ? store.telphone.split("-")[0] : "",
      phone: store.telphone ? store.telphone.split("-")[1] : "",
      contact: store.contact ?? "",
      contactPhone: store.contactPhone,
      latitude: store.latitude ?? "",
      longitude: store.longitude ?? "",
      county: oldCountyCode,
      district: store.district,
      address: store.address,
      employees: employees.filter((e) =>
        store.employees?.map((se) => se.id).includes(e.id),
      ),
      LineLink: store.LineLink ?? "",
      IGLink: store.IGLink ?? "",
      chargeImages: store.chargeImages,
      merchantId: store.merchantId ?? "",
      hashKey: store.hashKey ?? "",
      hashIV: store.hashIV ?? "",
      linepayChannelId: store.linepayChannelId ?? "",
      linepayChannelSecret: store.linepayChannelSecret ?? "",
      jkoApiKey: store.jkoApiKey ?? "",
      jkoSercertKey: store.jkoSercertKey ?? "",
      jkoStoreId: store.jkoStoreId ?? "",
      invoiceMerchantId: store.invoiceMerchantId ?? "",
      invoiceHashIV: store.invoiceHashIV ?? "",
      invoiceHashKey: store.invoiceHashKey ?? "",
      specialPlans: [
        day1
          ? day1
          : {
              day: 1,
              timeRanges: [],
            },
        day2
          ? day2
          : {
              day: 2,
              timeRanges: [],
            },
        day3
          ? day3
          : {
              day: 3,
              timeRanges: [],
            },
        day4
          ? day4
          : {
              day: 4,
              timeRanges: [],
            },
        day5
          ? day5
          : {
              day: 5,
              timeRanges: [],
            },
        day6
          ? day6
          : {
              day: 6,
              timeRanges: [],
            },
        day7
          ? day7
          : {
              day: 7,
              timeRanges: [],
            },
      ],
    },
  });

  const currentCountyCode = form.watch("county");

  const { data: districts } = useQuery({
    ...generateDistrictQuery(currentCountyCode ?? ""),
    enabled: !!currentCountyCode,
  });
  const { mutateAsync: deleteStore } = useMutation({
    mutationKey: ["delete-store"],
    mutationFn: async (id: string) => {
      return await privateFetch(`/store/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      navigate("/store-management");
      toast.success("刪除成功");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: () => {
      toast.error("刪除失敗");
    },
  });
  const [isMutating, setIsMutating] = useState(false);

  async function onSubmit() {
    const values = form.getValues();
    const dirtyFields = form.formState.dirtyFields;

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
      LineLink: values.LineLink,
      IGLink: values.IGLink,
      merchantId: values.merchantId,
      hashIV: values.hashIV,
      hashKey: values.hashKey,
      linepayChannelId: values.linepayChannelId,
      linepayChannelSecret: values.linepayChannelSecret,
      jkoApiKey: values.jkoApiKey,
      jkoSercertKey: values.jkoSercertKey,
      jkoStoreId: values.jkoStoreId,
      invoiceMerchantId: values.invoiceMerchantId,
      invoiceHashIV: values.invoiceHashIV,
      invoiceHashKey: values.invoiceHashKey,
      specialPlans: values.specialPlans,
    };

    const changedFields: Partial<typeof transformedValues> = {};
    if (dirtyFields.code) changedFields.code = transformedValues.code;
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
    if (dirtyFields.latitude)
      changedFields.latitude = transformedValues.latitude;
    if (dirtyFields.longitude)
      changedFields.longitude = transformedValues.longitude;
    if (dirtyFields.county) changedFields.county = transformedValues.county;
    if (dirtyFields.district)
      changedFields.district = transformedValues.district;
    if (dirtyFields.address) changedFields.address = transformedValues.address;
    if (dirtyFields.employees)
      changedFields.employeeIds = transformedValues.employeeIds;

    if (dirtyFields.LineLink)
      changedFields.LineLink = transformedValues.LineLink;
    if (dirtyFields.IGLink) changedFields.IGLink = transformedValues.IGLink;

    if (dirtyFields.merchantId)
      changedFields.merchantId = transformedValues.merchantId;
    if (dirtyFields.hashIV) changedFields.hashIV = transformedValues.hashIV;
    if (dirtyFields.hashKey) changedFields.hashKey = transformedValues.hashKey;

    if (dirtyFields.linepayChannelId)
      changedFields.linepayChannelId = transformedValues.linepayChannelId;
    if (dirtyFields.linepayChannelSecret)
      changedFields.linepayChannelSecret =
        transformedValues.linepayChannelSecret;

    if (dirtyFields.jkoApiKey)
      changedFields.jkoApiKey = transformedValues.jkoApiKey;
    if (dirtyFields.jkoSercertKey)
      changedFields.jkoSercertKey = transformedValues.jkoSercertKey;
    if (dirtyFields.jkoStoreId)
      changedFields.jkoStoreId = transformedValues.jkoStoreId;

    if (dirtyFields.invoiceMerchantId)
      changedFields.invoiceMerchantId = transformedValues.invoiceMerchantId;
    if (dirtyFields.invoiceHashIV)
      changedFields.invoiceHashIV = transformedValues.invoiceHashIV;
    if (dirtyFields.invoiceHashKey)
      changedFields.invoiceHashKey = transformedValues.invoiceHashKey;

    changedFields.specialPlans = transformedValues.specialPlans;

    setIsMutating(true);
    // submit(
    //   {
    //     ...changedFields,
    //     storeId: storeId as string,
    //   },
    //   {
    //     method: "post",
    //     action: pathname,
    //     encType: "application/json",
    //   },
    // );

    if (Object.keys(changedFields).length) {
      const response = await privateFetch(`/store/${storeId}`, {
        method: "PATCH",
        body: JSON.stringify(transformedValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast.error("更新廠商失敗");
        return setIsMutating(false);
      }
    }

    if (dirtyFields.chargeImages) {
      if (chargeImageId) {
        try {
          await privateFetch(
            `/store/${storeId}/charge-image/${chargeImageId}`,
            {
              method: "DELETE",
              credentials: "include",
            },
          );
          setChargeImageId("");
        } catch (e) {
          console.log(e);
        }
      }

      const newChargeImage = form.getValues("chargeImages");

      if (newChargeImage) {
        const formData = new FormData();
        formData.append("image", (values.chargeImages as FileList).item(0)!);
        await privateFetch(`/store/${storeId}/upload-charge-image`, {
          method: "POST",
          body: formData,
        });
      }
    }

    toast.success("更新廠商成功");
    queryClient.invalidateQueries({ queryKey: ["stores"] });
    // const url = new URL(request.url);
    setIsMutating(false);
    setDisabled(true);
    form.reset({
      code: form.getValues("code"),
      name: form.getValues("name"),
      category: form.getValues("category"),
      openingHoursStart: form.getValues("openingHoursStart"),
      openingHoursEnd: form.getValues("openingHoursEnd"),
      phoneAreaCode: form.getValues("phoneAreaCode"),
      phone: form.getValues("phone"),
      contact: form.getValues("contact"),
      contactPhone: form.getValues("contactPhone"),
      latitude: form.getValues("latitude"),
      longitude: form.getValues("longitude"),
      county: oldCountyCode,
      district: form.getValues("district"),
      address: form.getValues("address"),
      employees: form.getValues("employees"),
      LineLink: form.getValues("LineLink"),
      IGLink: form.getValues("IGLink"),
      chargeImages: form.getValues("chargeImages"),
      merchantId: form.getValues("merchantId"),
      hashKey: form.getValues("hashKey"),
      hashIV: form.getValues("hashIV"),
      linepayChannelId: form.getValues("linepayChannelId"),
      linepayChannelSecret: form.getValues("linepayChannelSecret"),
      jkoApiKey: form.getValues("jkoApiKey"),
      jkoSercertKey: form.getValues("jkoSercertKey"),
      jkoStoreId: form.getValues("jkoStoreId"),
      invoiceMerchantId: form.getValues("invoiceMerchantId"),
      invoiceHashKey: form.getValues("invoiceHashKey"),
      invoiceHashIV: form.getValues("invoiceHashIV"),
    });
  }

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <DetailsMobileMenubar
            onDeleteStore={async () => {
              setIsMutating(true);
              await deleteStore(storeId!);
              setIsMutating(false);
            }}
            disabled={disabled}
            form={form}
            isMutating={isMutating}
            setDisabled={setDisabled}
            storeName={store.name}
            onPatchStore={async () => {
              const success = await form.trigger();
              if (success) onSubmit();
            }}
          />
        ) : (
          <DetailsDesktopMenubar
            onSubmit={async () => {
              setIsMutating(true);
              await deleteStore(storeId!);
              setIsMutating(false);
            }}
            disabled={disabled}
            form={form}
            isMutating={isMutating}
            setDisabled={setDisabled}
            storeName={store.name}
          />
        )
      }
    >
      <div className="mb-2.5 w-full border border-line-gray p-1 ">
        <div className="bg-light-gray py-2.5  text-center">編輯廠商資料</div>
        <StoreForm
          disableCode
          counties={counties}
          districts={districts}
          employees={employees}
          form={form}
          isMutating={isMutating}
          onSubmit={onSubmit}
          disabled={disabled}
          setChargeImageId={setChargeImageId}
          // isSimulatorDetails={store.category === "simulator"}
        />
      </div>
    </MainLayout>
  );
}
