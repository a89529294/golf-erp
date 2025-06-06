import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";

import { useAuth } from "@/hooks/use-auth";
import { DetailsDesktopMenubar } from "@/pages/driving-range/site-management/components/details-desktop-menubar";
import { DetailsMobileMenubar } from "@/pages/driving-range/site-management/components/details-mobile-menubar";
import { filterObject } from "@/utils";
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
import { genSimulatorDetailsQuery, loader, SimulatorPATCH } from "./loader";
import { useIsMobile } from "@/hooks/use-is-mobile";

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
  const [defaultBannerImages, setDefaultBannerImages] = useState(
    data.bannerImages,
  );
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof existingIndoorSimulatorSchema>>({
    resolver: zodResolver(existingIndoorSimulatorSchema),
    defaultValues: {
      name: data.name,
      code: data.code,
      isActive: data.isActive,
      introduce: data.introduce,
      equipments: data.equipments,
      storeId: data.storeId,
      imageFiles: data.imageFiles,
      bannerImages: data.bannerImages,
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
      if (changedValues["introduce"]) x.introduce = changedValues.introduce;
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
        x.openTimes = changedValues["openingHours"].map((v, i) => ({
          startTime: v.start,
          endTime: v.end,
          sequence: i + 1,
        }));
      }

      if (changedValues["imageFiles"]) {
        const imagesToBeDeletedPromises: Promise<Response>[] = [];
        defaultImageFiles.forEach((v) => {
          if (!changedValues.imageFiles?.find((cif) => cif.id === v.id)) {
            imagesToBeDeletedPromises.push(
              privateFetch(`/store/simulator/${siteId}/cover/${v.id}`, {
                method: "DELETE",
              }),
            );
          }
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

      if (changedValues["bannerImages"]) {
        try {
          const imagesToBeDeletedPromises: Promise<Response>[] = [];
          defaultBannerImages.forEach((v) => {
            if (!changedValues.bannerImages?.find((cif) => cif.id === v.id)) {
              imagesToBeDeletedPromises.push(
                privateFetch(`/store/simulator/${siteId}/banner/${v.id}`, {
                  method: "DELETE",
                }),
              );
            }
          });
          const formData = new FormData();
          const imgIds = [] as string[];
          changedValues.bannerImages.forEach((v) => {
            if ("file" in v) {
              formData.append("image", v.file);
            } else imgIds.push(v.id);
          });
          await privateFetch(`/store/simulator/${siteId}/banner`, {
            method: "POST",
            body: formData,
          });
          // const imgData = (await resp.json()) as {
          //   coverImages: string[];
          // };
          // imgIds.push(...imgData.coverImages);
        } catch (e) {
          console.log(e);
        }
      }

      if (changedValues["equipments"]) {
        x.equipmentIds = changedValues.equipments.map((e) => e.id);
      }
      if (changedValues["plans"]) {
        x.plans = changedValues["plans"];
      }
      if (changedValues["isActive"]) x.isActive = changedValues["isActive"];

      if (Object.keys(changedValues).length === 1 && changedValues.imageFiles)
        return;

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
    setDefaultBannerImages(data.bannerImages);
  }, [data, form]);

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <DetailsMobileMenubar
            siteName={form.getValues("name")}
            deleteSite={deleteSite}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            onBackWithoutSave={() => {
              setFormDisabled(true);
              form.reset(data);
              setDefaultOpeningDates(data.openingDates);
              setDefaultImageFiles(data.imageFiles);
              setDefaultBannerImages(data.bannerImages);
            }}
            onPatchForm={async () => {
              const success = await form.trigger();
              if (success) mutate();
            }}
          />
        ) : (
          <DetailsDesktopMenubar
            siteName={form.getValues("name")}
            deleteSite={deleteSite}
            formDisabled={formDisabled}
            setFormDisabled={setFormDisabled}
            isPending={isPending}
            dirtyFieldsLength={Object.keys(form.formState.dirtyFields).length}
            onBackWithoutSave={() => {
              setFormDisabled(true);
              form.reset(data);
              setDefaultOpeningDates(data.openingDates);
              setDefaultImageFiles(data.imageFiles);
              setDefaultBannerImages(data.bannerImages);
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
