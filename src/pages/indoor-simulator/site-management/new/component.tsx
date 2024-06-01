import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import { newIndoorSimulatorSchema } from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loader } from "./loader";
import { useQuery } from "@tanstack/react-query";
import { indoorSimulatorStoresQuery } from "../loader";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery,
    initialData,
  });
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newIndoorSimulatorSchema>>({
    resolver: zodResolver(newIndoorSimulatorSchema),
    defaultValues: {
      name: "",
      description: "",
      equipments: equipments,
      imageFiles: [],
      openingDates: [],
      openingHours: [],
    },
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={() => navigate(-1)}>
            返回
          </IconButton>
          <IconButton icon="save" form="new-site" onClick={() => {}}>
            儲存
          </IconButton>
        </>
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          建立場地資料
        </h1>
        <Form {...form}>
          <Site
            type="indoor-simulator"
            formDisabled={false}
            stores={stores}
            addNewSite={() => {}}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
