import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";

import { existingIndoorSimulatorSchema } from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { genSimulatorDetailsQuery, loader, SimulatorPATCH } from "./loader";
import { indoorSimulatorStoresQuery } from "../loader";
import { equipments } from "@/utils/category/equipment";
import { filterObject } from "@/utils";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function Component() {
  const queryClient = useQueryClient();
  const { storeId, siteId } = useParams();
  const [formDisabled, setFormDisabled] = useState(true);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genSimulatorDetailsQuery(storeId!, siteId!),
    initialData: initialData.details,
  });
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery,
    initialData: initialData.stores,
  });
  const [defaultOpeningDates, setDefaultOpeningDates] = useState(
    data.openingDates,
  );
  const [defaultOpeningHours, setDefaultOpeningHours] = useState(
    data.openingHours,
  );
  const [defaultImageFiles, setDefaultImageFiles] = useState(data.imageFiles);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof existingIndoorSimulatorSchema>>({
    resolver: zodResolver(existingIndoorSimulatorSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      equipments: equipments,
      storeId: data.storeId,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      openingHours: data.openingHours,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["edit-simulator-site"],
    mutationFn: async () => {
      const dirtyFields = form.formState.dirtyFields;
      const changedValues = filterObject(
        form.getValues(),
        Object.keys(dirtyFields) as (keyof typeof dirtyFields)[],
      );

      const x = {} as Partial<SimulatorPATCH>;
      if (changedValues["name"]) x.name = changedValues["name"];
      if (changedValues["description"]) x.introduce = changedValues.description;
      if (changedValues["storeId"]) x.storeId = changedValues.storeId;
      if (changedValues["openingDates"]) {
        x.openDays = [];
        changedValues["openingDates"].forEach((v, i) => {
          if (defaultOpeningDates.find((dod) => dod.id === v.id))
            x.openDays?.push({
              id: v.id,
              startDay: v.start ?? new Date(),
              endDay: v.end ?? new Date(),
              sequence: i + 1,
            });
          else
            x.openDays?.push({
              startDay: v.start ?? new Date(),
              endDay: v.end ?? new Date(),
              sequence: i + 1,
            });
        });
      }
      if (changedValues["openingHours"]) {
        x.openTimes = [];
        changedValues.openingHours.forEach((v, i) => {
          if (defaultOpeningHours.find((doh) => doh.id === v.id))
            x.openTimes?.push({
              id: v.id,
              startTime: `${new Date().toISOString().slice(0, 10)}T${v.start}`,
              endTime: `${new Date().toISOString().slice(0, 10)}T${v.end}`,
              sequence: i + 1,
              pricePerHour: v.fee || 0,
            });
          else
            x.openTimes?.push({
              startTime: `${new Date().toISOString().slice(0, 10)}T${v.start}`,
              endTime: `${new Date().toISOString().slice(0, 10)}T${v.end}`,
              sequence: i + 1,
              pricePerHour: v.fee || 0,
            });
        });
      }
      if (changedValues["imageFiles"]) {
        const imagesToBeDeletedPromises: Promise<Response>[] = [];
        defaultImageFiles.forEach((v) => {
          if (!changedValues.imageFiles?.find((cif) => cif.id === v.id))
            imagesToBeDeletedPromises.push(
              privateFetch(`/store/simulator/${siteId}/cover/${v.id}`, {
                method: "DELETE",
              }),
            );
        });
        const formData = new FormData();
        changedValues.imageFiles.forEach((v) => {
          if ("file" in v) {
            formData.append("image", v.file);
          }
        });
        privateFetch(`/store/simulator/${siteId}/cover`, {
          method: "POST",
          body: formData,
        });
      }
      if (changedValues["equipments"]) {
        x.equipment = JSON.stringify(
          changedValues.equipments.map((e) => ({
            name: e.label,
            isActive: e.selected,
          })),
        );
      }

      await privateFetch(`/store/simulator/${siteId}`, {
        method: "PATCH",
        body: JSON.stringify(x),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("更新成功");
      setFormDisabled(true);
      queryClient.invalidateQueries({
        queryKey: ["simulator-details", storeId, siteId],
      });
      queryClient.invalidateQueries({ queryKey: ["sites-for-store"] });
    },
    onError() {
      toast.error("更新失敗");
    },
  });

  useEffect(() => {
    form.reset(data);
    setDefaultOpeningDates(data.openingDates);
    setDefaultOpeningHours(data.openingHours);
    setDefaultImageFiles(data.imageFiles);
  }, [data, form]);

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>
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
              disabled={isPending || !form.formState.isDirty}
              icon="save"
              type="submit"
              form="site-details"
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <div className="flex flex-col w-full gap-10 p-1 border border-line-gray bg-light-gray">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          {formDisabled ? "檢視場地資料" : "編輯場地資料"}
        </h1>
        <Form {...form}>
          <Site
            onSubmit={() => {
              mutate();
            }}
            stores={stores}
            formDisabled={formDisabled || isPending}
            type="indoor-simulator"
          />
        </Form>
      </div>
    </MainLayout>
  );
}
