import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { filterObject } from "@/utils";
import { equipments } from "@/utils/category/equipment";
import { existingDrivingRangeSchema } from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { groundStoresQuery } from "../loader";
import { genDrivingRangeDetailsQuery, loader } from "./loader";

export function Component() {
  const queryClient = useQueryClient();
  const { storeId, siteId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genDrivingRangeDetailsQuery(storeId!, siteId!),
    initialData: initialData.details,
  });
  const { data: stores } = useQuery({
    ...groundStoresQuery,
    initialData: initialData.stores,
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
      description: data.description,
      storeId: data.storeId,
      equipments: equipments,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      venueSettings: data.venueSettings,
      costPerBox: data.costPerBox,
    },
  });
  const [formDisabled, setFormDisabled] = useState(true);
  const { mutate } = useMutation({
    mutationKey: ["patch-driving-range"],
    mutationFn: async () => {
      const changedFields = filterObject(
        form.getValues(),
        Object.keys(
          form.formState.dirtyFields,
        ) as (keyof typeof form.formState.dirtyFields)[],
      );

      console.log(changedFields);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const x: Record<string, any> = {};
      if ("name" in changedFields) x.name = changedFields.name;
      if ("description" in changedFields)
        x.introduce = changedFields.description;
      if ("storeId" in changedFields) x.storeId = changedFields.storeId;
      if ("costPerBox" in changedFields) x.ballPrice = changedFields.costPerBox;
      if ("openingDates" in changedFields) {
        x.openDays = [] as { id: string; startDay: string; endDay: string }[];
        changedFields.openingDates?.forEach((od) => {
          if (defaultOpeningDates.find((dod) => dod.id === od.id)) {
            x.openDays.push({
              id: od.id,
              startDay: od.start,
              endDay: od.end,
            });
          } else {
            x.openDays.push({ startDay: od.start, endDay: od.end });
          }
        });
      }
      if ("venueSettings" in changedFields) {
        x.openTimes = [] as {
          id: string;
          startTime: string;
          endTime: string;
          pricePerHour: number;
          openQuantity: number;
          openBallQuantity: number;
        }[];

        changedFields.venueSettings?.forEach((vs) => {
          if (defaultVenueSettings.find((dvs) => dvs.id === vs.id))
            x.openTimes.push({
              id: vs.id,
              startTime: `${new Date().toISOString().slice(0, 10)}T${vs.start}`,
              endTime: `${new Date().toISOString().slice(0, 10)}T${vs.end}`,
              pricePerHour: vs.fee,
              openQuantity: vs.numberOfGroups,
              openBallQuantity: vs.numberOfBalls,
            });
          else
            x.openTimes.push({
              startTime: `${new Date().toISOString().slice(0, 10)}T${vs.start}`,
              endTime: `${new Date().toISOString().slice(0, 10)}T${vs.end}`,
              pricePerHour: vs.fee,
              openQuantity: vs.numberOfGroups,
              openBallQuantity: vs.numberOfBalls,
            });
        });
      }
      if ("imageFiles" in changedFields) {
        const deletedImages = defaultImageFiles.filter(
          (dif) => !changedFields.imageFiles?.find((cif) => cif.id === dif.id),
        );
        const promises: Promise<Response>[] = [];
        deletedImages.forEach((di) =>
          promises.push(privateFetch(`/store/ground/${siteId}/cover/${di.id}`)),
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
  });

  useEffect(() => {
    console.log("form defuault reset");
    form.reset(data);
    setDefaultImageFiles(data.imageFiles);
    setDefaultOpeningDates(data.openingDates);
    setDefaultVenueSettings(data.venueSettings);
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
              onClick={(e) => {
                e.preventDefault();
                setFormDisabled(false);
              }}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton icon="save" form="new-site" onClick={() => {}}>
              儲存
            </IconButton>
          )}
        </>
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
            stores={stores}
            type="driving-range"
            formDisabled={formDisabled}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
