import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { indoorSimulatorSiteQuery } from "@/pages/indoor-simulator/site-management/details/loader";
import { existingIndoorSimulatorSchema } from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loader } from "./loader";
import { indoorSimulatorStoresQuery } from "../loader";

export function Component() {
  const [formDisabled, setFormDisabled] = useState(true);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...indoorSimulatorSiteQuery,
    initialData: initialData.details,
  });
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery,
    initialData: initialData.stores,
  });
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof existingIndoorSimulatorSchema>>({
    resolver: zodResolver(existingIndoorSimulatorSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      openingHours: data.openingHours,
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
              onClick={() => setTimeout(() => setFormDisabled(false), 0)}
            >
              編輯
            </IconButton>
          ) : (
            <IconButton
              icon="save"
              type="submit"
              form="edit-site"
              onClick={() => {}}
            >
              儲存
            </IconButton>
          )}
        </>
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          {formDisabled ? "檢視場地資料" : "編輯場地資料"}
        </h1>
        <Form {...form}>
          <Site
            addNewSite={() => {}}
            stores={stores}
            formDisabled={formDisabled}
            type="indoor-simulator"
          />
        </Form>
      </div>
    </MainLayout>
  );
}
