import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import {
  ExistingDrivingRange,
  existingDrivingRangeSchema,
} from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { genDrivingRangeDetailsQuery, loader } from "./loader";
import { useState } from "react";
import { groundStoresQuery } from "../loader";
import { ValueOf } from "@/utils/types";
import { filterObject } from "@/utils";

export function Component() {
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
    },
  });

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
              console.log(form.formState.dirtyFields);
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
