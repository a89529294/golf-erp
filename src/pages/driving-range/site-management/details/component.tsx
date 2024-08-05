import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { DetailsDesktopMenubar } from "@/pages/driving-range/site-management/components/details-desktop-menubar";
import { DetailsMobileMenubar } from "@/pages/driving-range/site-management/components/details-mobile-menubar";
import { filterObject } from "@/utils";
import { existingDrivingRangeSchema } from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import {
  genDrivingRangeDetailsQuery,
  loader,
  type DrivingRangePATCH,
} from "./loader";

export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { storeId, siteId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genDrivingRangeDetailsQuery(storeId!, siteId!),
    initialData: initialData.details,
  });

  const navigate = useNavigate();
  const [defaultOpeningDates, setDefaultOpeningDates] = useState(
    data.openingDates,
  );
  const [defaultVenueSettings, setDefaultVenueSettings] = useState(
    data.venueSettings,
  );
  const [defaultImageFiles, setDefaultImageFiles] = useState(data.imageFiles);
  const form = useForm<z.infer<typeof existingDrivingRangeSchema>>({
    resolver: zodResolver(existingDrivingRangeSchema),
    defaultValues: {
      name: data.name,
      isActive: data.isActive,
      description: data.description,
      storeId: data.storeId,
      equipments: data.equipments,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      venueSettings: data.venueSettings,
      costPerBox: data.costPerBox,
      plans: data.plans,
    },
  });
  const [formDisabled, setFormDisabled] = useState(true);
  const { mutate, isPending } = useMutation({
    mutationKey: ["patch-driving-range"],
    mutationFn: async () => {
      const changedFields = filterObject(
        form.getValues(),
        Object.keys(
          form.formState.dirtyFields,
        ) as (keyof typeof form.formState.dirtyFields)[],
      );

      const x = {} as Partial<DrivingRangePATCH>;
      if ("name" in changedFields) x.name = changedFields.name;
      if ("description" in changedFields)
        x.introduce = changedFields.description;
      if ("storeId" in changedFields) x.storeId = changedFields.storeId;
      if ("costPerBox" in changedFields) x.ballPrice = changedFields.costPerBox;
      if ("equipments" in changedFields)
        x.equipment = JSON.stringify(
          changedFields.equipments?.map((e) => ({
            name: e.label,
            isActive: e.selected,
          })),
        );
      if (changedFields["plans"]) {
        x.plans = changedFields["plans"];
      }
      if ("openingDates" in changedFields) {
        changedFields.openingDates?.forEach((od, i) => {
          if (defaultOpeningDates.find((dod) => dod.id === od.id)) {
            x.openDays ||= [];
            x.openDays.push({
              id: od.id,
              startDay: od.start ?? new Date(),
              endDay: od.end ?? new Date(),
              sequence: i + 1,
            });
          } else {
            x.openDays ||= [];
            x.openDays.push({
              startDay: od.start ?? new Date(),
              endDay: od.end ?? new Date(),
              sequence: i + 1,
            });
          }
        });
      }
      if ("venueSettings" in changedFields) {
        changedFields.venueSettings?.forEach((vs, i) => {
          if (defaultVenueSettings.find((dvs) => dvs.id === vs.id)) {
            x.openTimes ||= [];
            x.openTimes.push({
              id: vs.id,
              startTime: vs.start + ":00",
              endTime: vs.end + ":00",
              sequence: i + 1,
            });
          } else {
            x.openTimes ||= [];
            x.openTimes.push({
              startTime: vs.start + ":00",
              endTime: vs.end + ":00",

              sequence: i + 1,
            });
          }
        });
      }
      if (changedFields.isActive) x.isActive = changedFields.isActive;
      if ("imageFiles" in changedFields) {
        const deletedImages = defaultImageFiles.filter(
          (dif) => !changedFields.imageFiles?.find((cif) => cif.id === dif.id),
        );
        const promises: Promise<Response>[] = [];
        deletedImages.forEach((di) =>
          promises.push(
            privateFetch(`/store/ground/${siteId}/cover/${di.id}`, {
              method: "DELETE",
            }),
          ),
        );
        const newImages = changedFields.imageFiles!.filter(
          (cif): cif is { id: string; file: File } => "file" in cif,
        );

        const formData = new FormData();
        newImages.forEach((img) => formData.append("image", img.file));
        promises.push(
          privateFetch(`/store/ground/${siteId}/cover`, {
            method: "POST",
            body: formData,
          }),
        );
        await Promise.all(promises);
      }

      await privateFetch(`/store/ground/${siteId}`, {
        method: "PATCH",
        body: JSON.stringify(x),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("更新成功");
      queryClient.invalidateQueries({
        queryKey: ["driving-range-details", storeId, siteId],
      });
      setFormDisabled(true);
    },
    onError: () => {
      toast.error("更新失敗");
    },
  });
  const { mutateAsync: deleteSite } = useMutation({
    mutationKey: ["delete-ground-site"],
    mutationFn: async () => {
      await privateFetch(`/store/ground/${siteId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      navigate(`/driving-range/site-management/${storeId}`);
      queryClient.invalidateQueries({ queryKey: ["sites-for-store"] });
      toast.success("刪除成功");
    },
    onError() {
      toast.error("刪除失敗");
    },
  });

  useEffect(() => {
    form.reset(data);
    setDefaultImageFiles(data.imageFiles);
    setDefaultOpeningDates(data.openingDates);
    setDefaultVenueSettings(data.venueSettings);
  }, [data, form]);

  function onBackWithoutSave() {
    setFormDisabled(true);
    form.reset(data);
    setDefaultImageFiles(data.imageFiles);
    setDefaultOpeningDates(data.openingDates);
    setDefaultVenueSettings(data.venueSettings);
  }

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <DetailsMobileMenubar
            deleteSite={deleteSite}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            formDisabled={formDisabled}
            isPending={isPending}
            onBackWithoutSave={onBackWithoutSave}
            setFormDisabled={setFormDisabled}
            siteName={form.getValues("name")}
            onPatchForm={mutate}
          />
        ) : (
          <DetailsDesktopMenubar
            deleteSite={deleteSite}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            formDisabled={formDisabled}
            isPending={isPending}
            onBackWithoutSave={onBackWithoutSave}
            setFormDisabled={setFormDisabled}
            siteName={form.getValues("name")}
          />
        )
      }
    >
      <div className="flex flex-col w-full gap-10 p-1 border border-line-gray bg-light-gray">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          編輯場地資料
        </h1>
        <Form {...form}>
          <Site
            onSubmit={() => {
              mutate();
            }}
            stores={[data.store]}
            type="driving-range"
            formDisabled={formDisabled || isPending}
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
