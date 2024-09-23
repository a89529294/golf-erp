import { MainLayout } from "@/layouts/main-layout";
import { loader } from "@/pages/store-management/details/loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";

import { countyQuery, generateDistrictQuery } from "@/api/county-district";
import { DetailsDesktopMenubar } from "@/pages/store-management/components/details-desktop-menubar";
import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { StoreForm } from "../components/store-form";
import { formSchema } from "../schemas";
import { genStoreQuery } from "./loader";
import { DetailsMobileMenubar } from "@/pages/store-management/components/details-mobile-menubar";
import { useIsMobile } from "@/hooks/use-is-mobile";

export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
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
      merchantId: store.merchantId ?? "",
      hashKey: store.hashKey ?? "",
      hashIV: store.hashIV ?? "",
      linepayChannelId: store.linepayChannelId ?? "",
      linepayChannelSecret: store.linepayChannelSecret ?? "",
      invoiceMerchantId: store.invoiceMerchantId ?? "",
      invoiceHashIV: store.invoiceHashIV ?? "",
      invoiceHashKey: store.invoiceHashKey ?? "",
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

  function onSubmit() {
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
      merchantId: values.merchantId,
      hashIV: values.hashIV,
      hashKey: values.hashKey,
      linepayChannelId: values.linepayChannelId,
      linepayChannelSecret: values.linepayChannelSecret,
      invoiceMerchantId: values.invoiceMerchantId,
      invoiceHashIV: values.invoiceHashIV,
      invoiceHashKey: values.invoiceHashKey,
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
    if (dirtyFields.merchantId)
      changedFields.merchantId = transformedValues.merchantId;
    if (dirtyFields.hashIV) changedFields.hashIV = transformedValues.hashIV;
    if (dirtyFields.hashKey) changedFields.hashKey = transformedValues.hashKey;

    if (dirtyFields.linepayChannelId)
      changedFields.linepayChannelId = transformedValues.linepayChannelId;
    if (dirtyFields.linepayChannelSecret)
      changedFields.linepayChannelSecret =
        transformedValues.linepayChannelSecret;

    if (dirtyFields.invoiceMerchantId)
      changedFields.invoiceMerchantId = transformedValues.invoiceMerchantId;
    if (dirtyFields.invoiceHashIV)
      changedFields.invoiceHashIV = transformedValues.invoiceHashIV;
    if (dirtyFields.invoiceHashKey)
      changedFields.invoiceHashKey = transformedValues.invoiceHashKey;

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
      setSearchParams({});
    } else {
      setIsMutating(false);
      setDisabled(true);
      setSearchParams({});
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
        merchantId: form.getValues("merchantId"),
        hashKey: form.getValues("hashKey"),
        hashIV: form.getValues("hashIV"),
        linepayChannelId: form.getValues("linepayChannelId"),
        linepayChannelSecret: form.getValues("linepayChannelSecret"),
        invoiceMerchantId: form.getValues("invoiceMerchantId"),
        invoiceHashKey: form.getValues("invoiceHashKey"),
        invoiceHashIV: form.getValues("invoiceHashIV"),
      });
    }
  }, [searchParams, setSearchParams, form, oldCountyCode]);

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
          counties={counties}
          districts={districts}
          employees={employees}
          form={form}
          isMutating={isMutating}
          onSubmit={onSubmit}
          disabled={disabled}
          // isSimulatorDetails={store.category === "simulator"}
        />
      </div>
    </MainLayout>
  );
}
