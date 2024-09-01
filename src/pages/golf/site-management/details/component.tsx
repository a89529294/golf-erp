import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { DetailsDesktopMenubar } from "@/pages/driving-range/site-management/components/details-desktop-menubar";
import { filterObject, fromDateToDateTimeString } from "@/utils";
import {
  ExistingGolfCourse,
  existingGolfCourseSchema,
} from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { genGolfSiteDetailsQuery, loader } from "./loader";
import { DetailsMobileMenubar } from "@/pages/driving-range/site-management/components/details-mobile-menubar";

export function Component() {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [formDisabled, setFormDisabled] = useState(true);
  const navigate = useNavigate();
  const { storeId, siteId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genGolfSiteDetailsQuery(storeId!, siteId!),
    initialData: initialData.details,
  });
  const form = useForm<ExistingGolfCourse>({
    resolver: zodResolver(existingGolfCourseSchema),
    defaultValues: {
      name: data.name,
      isActive: data.isActive,
      description: data.introduce,
      equipments: data.equipments,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      storeId: data.store.id,
      monday: data.openTimes.filter((v) => v.day === 1),
      tuesday: data.openTimes.filter((v) => v.day === 2),
      wednesday: data.openTimes.filter((v) => v.day === 3),
      thursday: data.openTimes.filter((v) => v.day === 4),
      friday: data.openTimes.filter((v) => v.day === 5),
      saturday: data.openTimes.filter((v) => v.day === 6),
      sunday: data.openTimes.filter((v) => v.day === 0),
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["patch-golf-site"],
    mutationFn: async () => {
      const promises: Promise<Response>[] = [];
      const x: Partial<{
        name: string;
        isActive: boolean;
        introduce: string;
        storeId: string;
        equipmentIds: string[];
        openDays: { startDay: string; endDay: string; sequence: number }[];
        openTimes: {
          startTime: string;
          endTime: string;
          pricePerHour: string;
          openQuantity: number;
          sequence: number;
        }[];
      }> = {};

      const changedValues = filterObject(
        form.getValues(),
        Object.keys(
          form.formState.dirtyFields,
        ) as (keyof typeof form.formState.dirtyFields)[],
      );

      if (changedValues["name"]) x.name = changedValues.name;
      if (changedValues.description) x.introduce = changedValues.description;
      if (changedValues.storeId) x.storeId = changedValues.storeId;
      if (changedValues.equipments)
        x.equipmentIds = changedValues.equipments.map((e) => e.id);
      if (changedValues.openingDates)
        x.openDays = changedValues.openingDates.map((od, i) => ({
          startDay: fromDateToDateTimeString(new Date(od.start!)),
          endDay: fromDateToDateTimeString(new Date(od.end!)),
          sequence: i + 1,
        }));
      if (
        changedValues.monday ||
        changedValues.tuesday ||
        changedValues.wednesday ||
        changedValues.thursday ||
        changedValues.friday ||
        changedValues.saturday ||
        changedValues.sunday
      ) {
        x.openTimes = [
          form.getValues("sunday"),
          form.getValues("monday"),
          form.getValues("tuesday"),
          form.getValues("wednesday"),
          form.getValues("thursday"),
          form.getValues("friday"),
          form.getValues("saturday"),
        ].flatMap((arr, idx) =>
          arr.map((d, i) => ({
            title: d.title,
            startTime: `2022-01-01T${d.start}`,
            endTime: `2022-01-01T${d.end}`,
            day: idx,
            openQuantity: +d.numberOfGroups,
            sequence: i + 1,
            pricePerHour: JSON.stringify(
              d.subRows.map((v) => ({
                membershipType: v.memberLevel,
                1: v.partyOf1Fee,
                2: v.partyOf2Fee,
                3: v.partyOf3Fee,
                4: v.partyOf4Fee,
              })),
            ),
          })),
        );
      }
      if (changedValues.isActive) x.isActive = changedValues.isActive;

      if (changedValues.imageFiles) {
        // new images
        const formData = new FormData();

        changedValues.imageFiles.forEach((img) => {
          if ("file" in img) formData.append("image", img.file);
        });

        promises.push(
          privateFetch(`/store/golf/${siteId}/cover`, {
            method: "POST",
            body: formData,
          }),
        );

        // removed images
        data.imageFiles.forEach((img) => {
          if (!changedValues.imageFiles?.find((ci) => ci.id === img.id))
            promises.push(
              privateFetch(`/store/golf/${siteId}/cover/${img.id}`, {
                method: "DELETE",
              }),
            );
        });
      }

      promises.push(
        privateFetch(`/store/golf/${siteId}`, {
          method: "PATCH",
          body: JSON.stringify(x),
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      await Promise.all(promises);
    },
    onSuccess() {
      setFormDisabled(true);
      toast.success("編輯成功");
      queryClient.invalidateQueries({
        queryKey: ["golf-site-details"],
      });
    },
    onError() {
      toast.error("編輯失敗");
    },
  });
  const { mutateAsync: deleteSite } = useMutation({
    mutationKey: ["delete-golf-site"],
    mutationFn: async () => {
      await privateFetch(`/store/golf/${siteId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      navigate(`/golf/site-management/${storeId}`);
      queryClient.invalidateQueries({ queryKey: ["sites-for-store"] });
      toast.success("刪除成功");
    },
    onError() {
      toast.error("刪除失敗");
    },
  });

  useEffect(() => {
    form.reset({
      name: data.name,
      isActive: data.isActive,
      description: data.introduce,
      equipments: data.equipments,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      storeId: data.store.id,
      monday: data.openTimes.filter((v) => v.day === 1),
      tuesday: data.openTimes.filter((v) => v.day === 2),
      wednesday: data.openTimes.filter((v) => v.day === 3),
      thursday: data.openTimes.filter((v) => v.day === 4),
      friday: data.openTimes.filter((v) => v.day === 5),
      saturday: data.openTimes.filter((v) => v.day === 6),
      sunday: data.openTimes.filter((v) => v.day === 0),
      store: data.store,
    });
  }, [data, form]);

  function onBackWithoutSave() {
    setFormDisabled(true);
    form.reset({
      name: data.name,
      isActive: data.isActive,
      description: data.introduce,
      equipments: data.equipments,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      storeId: data.store.id,
      monday: data.openTimes.filter((v) => v.day === 1),
      tuesday: data.openTimes.filter((v) => v.day === 2),
      wednesday: data.openTimes.filter((v) => v.day === 3),
      thursday: data.openTimes.filter((v) => v.day === 4),
      friday: data.openTimes.filter((v) => v.day === 5),
      saturday: data.openTimes.filter((v) => v.day === 6),
      sunday: data.openTimes.filter((v) => v.day === 0),
      store: data.store,
    });
  }

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <DetailsMobileMenubar
            deleteSite={deleteSite}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            onBackWithoutSave={onBackWithoutSave}
            siteName={form.getValues("name")}
            onPatchForm={mutate}
          />
        ) : (
          <DetailsDesktopMenubar
            deleteSite={deleteSite}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            onBackWithoutSave={onBackWithoutSave}
            siteName={form.getValues("name")}
          />
        )
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          建立場地資料
        </h1>
        <Form {...form}>
          <Site
            onSubmit={() => {
              mutate();
            }}
            stores={[data.store]}
            formDisabled={formDisabled || isPending}
            type={"golf"}
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
