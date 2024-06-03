import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import {
  NewDrivingRange,
  newDrivingRangeSchema,
} from "@/utils/category/schemas";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { groundStoresQuery } from "../loader";
import { loader } from "./loader";

export function Component() {
  const navigate = useNavigate();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...groundStoresQuery,
    initialData,
  });
  const form = useForm<z.infer<typeof newDrivingRangeSchema>>({
    resolver: zodResolver(newDrivingRangeSchema),
    defaultValues: {
      name: "",
      description: "",
      storeId: "",
      equipments: equipments,
      imageFiles: [],
      openingDates: [],
      venueSettings: [],
      costPerBox: 0,
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-ground-site"],
    mutationFn: async (v: NewDrivingRange) => {
      const response = await privateFetch("/store/ground", {
        method: "POST",
        body: JSON.stringify({
          name: v.name,
          introduce: v.description,
          ballPrice: v.costPerBox,
          storeId: v.storeId,
          openDays: v.openingDates.map((od, idx) => ({
            sequence: idx + 1,
            startDay: od.start?.toISOString(),
            endDay: od.end?.toISOString(),
          })),
          openTimes: v.venueSettings.map((v, idx) => ({
            sequence: idx + 1,
            startTime: `${new Date().toISOString().slice(0, 10)}T${v.start}`,
            endTime: `${new Date().toISOString().slice(0, 10)}T${v.end}`,
            pricePerHour: v.fee,
            openQuantity: v.numberOfGroups,
            openBallQuantity: v.numberOfBalls,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (v.imageFiles) {
        const formData = new FormData();
        v.imageFiles.map((img) => formData.append("image", img.file));

        await privateFetch(`/store/ground/${data.id}/cover`, {
          method: "POST",
          body: formData,
        });
      }
    },
    onSuccess: () => {
      navigate(
        linksKV["driving-range"]["subLinks"]["site-management"]["paths"][
          "index"
        ] + `?storeId=${form.getValues("storeId")}`,
      );
      toast.success("新增場地");
    },
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton
            disabled={isPending}
            icon="back"
            onClick={() => navigate(-1)}
          >
            返回
          </IconButton>
          <IconButton disabled={isPending} icon="save" form="new-site">
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
            type="driving-range"
            formDisabled={isPending}
            stores={stores}
            addNewSite={(v) => mutate(v as NewDrivingRange)}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
