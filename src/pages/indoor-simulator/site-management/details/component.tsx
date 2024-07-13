import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";

import { useAuth } from "@/hooks/use-auth";
import { DetailsSimulatorDesktopMenubar } from "@/pages/indoor-simulator/site-management/components/details-simulator-desktop-menubar";
import { filterObject } from "@/utils";
import { equipments } from "@/utils/category/equipment";
import { existingIndoorSimulatorSchema } from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { indoorSimulatorStoresQuery } from "../loader";
import { SimulatorPATCH, genSimulatorDetailsQuery, loader } from "./loader";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { DetailsSimulatorMobileMenubar } from "@/pages/indoor-simulator/site-management/components/details-simultor-mobile-menubar";

export function Component() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { storeId, siteId } = useParams();
  const [formDisabled, setFormDisabled] = useState(true);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genSimulatorDetailsQuery(storeId!, siteId!),
    initialData: initialData.details,
  });
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
    initialData: initialData.stores,
  });

  const [defaultOpeningDates, setDefaultOpeningDates] = useState(
    data.openingDates,
  );
  const [defaultImageFiles, setDefaultImageFiles] = useState(data.imageFiles);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof existingIndoorSimulatorSchema>>({
    resolver: zodResolver(existingIndoorSimulatorSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      isActive: data.isActive,
      description: data.description,
      equipments: equipments,
      storeId: data.storeId,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      openingHours: data.openingHours,
      plans: data.plans,
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
        if (changedValues["openingHours"][0])
          x.openTimes = [
            {
              startTime: changedValues["openingHours"][0].start,
              endTime: changedValues["openingHours"][0].end,
              sequence: 1,
            },
          ];
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
        const imgIds = [] as string[];
        changedValues.imageFiles.forEach((v) => {
          if ("file" in v) {
            formData.append("image", v.file);
          } else imgIds.push(v.id);
        });
        const resp = await privateFetch(`/store/simulator/${siteId}/cover`, {
          method: "POST",
          body: formData,
        });
        const imgData = (await resp.json()) as {
          coverImages: string[];
        };
        imgIds.push(...imgData.coverImages);
      }
      if (changedValues["equipments"]) {
        x.equipment = JSON.stringify(
          changedValues.equipments.map((e) => ({
            name: e.label,
            isActive: e.selected,
          })),
        );
      }
      if (changedValues["plans"]) {
        x.plans = changedValues["plans"];
      }
      if (changedValues["isActive"]) x.isActive = changedValues["isActive"];
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
  const { mutateAsync: deleteSite } = useMutation({
    mutationKey: ["delete-simulator-site"],
    mutationFn: async () => {
      await privateFetch(`/store/simulator/${siteId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      navigate(`/indoor-simulator/site-management/${storeId}`);
      toast.success("刪除成功");
    },
    onError() {
      toast.error("刪除失敗");
    },
  });

  useEffect(() => {
    form.reset(data);
    setDefaultOpeningDates(data.openingDates);
    setDefaultImageFiles(data.imageFiles);
  }, [data, form]);

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <DetailsSimulatorMobileMenubar
            deleteModalTitle={`確認刪除${form.getValues("name")}`}
            deleteSite={deleteSite}
            form={form}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            onReset={() => {
              setFormDisabled(true);
              form.reset(data);
              setDefaultOpeningDates(data.openingDates);
              setDefaultImageFiles(data.imageFiles);
            }}
            onSubmit={async () => {
              const success = await form.trigger();
              if (success) mutate();
            }}
          />
        ) : (
          <DetailsSimulatorDesktopMenubar
            deleteModalTitle={`確認刪除${form.getValues("name")}`}
            deleteSite={deleteSite}
            form={form}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            onReset={() => {
              setFormDisabled(true);
              form.reset(data);
              setDefaultOpeningDates(data.openingDates);
              setDefaultImageFiles(data.imageFiles);
            }}
          />
        )
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
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
            type="existing-indoor-simulator"
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
