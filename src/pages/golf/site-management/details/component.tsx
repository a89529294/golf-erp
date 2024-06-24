import { Site } from "@/components/category/site";
import { Modal } from "@/components/modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { filterObject, fromDateToDateTimeString } from "@/utils";
import {
  ExistingGolfCourse,
  existingGolfCourseSchema,
} from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { genGolfSiteDetailsQuery, loader } from "./loader";

export function Component() {
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
      imageFiles: data.coverImages,
      openingDates: data.openDays,
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
        equipments: string;
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
        x.equipments = JSON.stringify(
          changedValues.equipments.map((e) => ({
            name: e.label,
            isActive: e.selected,
          })),
        );
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
                membershiptType: v.memberLevel,
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
        data.coverImages.forEach((img) => {
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
      return privateFetch(`/store/golf/${siteId}`, { method: "DELETE" });
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

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>

          <Modal
            dialogTriggerChildren={
              <IconWarningButton icon="trashCan">刪除</IconWarningButton>
            }
            title={`確認刪除${form.getValues("name")}`}
            onSubmit={deleteSite}
          />

          {formDisabled ? (
            <IconButton
              icon="pencil"
              type="button"
              onClick={() => setTimeout(() => setFormDisabled(false), 0)}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              icon="save"
              type="submit"
              form="site-details"
              onClick={() => {}}
              disabled={
                Object.keys(form.formState.dirtyFields).length === 0 ||
                isPending
              }
            >
              儲存
            </IconButton>
          )}
        </>
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
