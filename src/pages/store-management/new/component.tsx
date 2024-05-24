import { IconButton } from "@/components/ui/button";

import { MainLayout } from "@/layouts/main-layout";

import { Modal } from "@/components/modal";
import {
  countyQuery,
  generateDistrictQuery,
  loader,
} from "@/pages/store-management/new/loader";
import { storeCategories } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { z } from "zod";

import { genEmployeesQuery } from "@/pages/system-management/personnel-management/loader";
import { StoreForm } from "../components/store-form";
import { formSchema } from "../schemas";

export function Component() {
  const submit = useSubmit();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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
          <IconButton disabled={isMutating} icon="save" form="store-form">
            儲存
          </IconButton>
        </>
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
