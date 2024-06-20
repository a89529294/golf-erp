import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import { newIndoorSimulatorSchema } from "@/utils/category/schemas";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { indoorSimulatorStoresQuery } from "../loader";
import { loader } from "./loader";
import { useAuth } from "@/hooks/use-auth";

export function Component() {
  const { user } = useAuth();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery,
    initialData,
  });
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newIndoorSimulatorSchema>>({
    resolver: zodResolver(newIndoorSimulatorSchema),
    defaultValues: {
      name: "",
      isActive: false,
      description: "",
      equipments: equipments,
      imageFiles: [],
      openingDates: [],
      openingHours: undefined,
      plans: [],
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-indoor-simulator-site"],
    mutationFn: async () => {
      console.log(form.formState.dirtyFields.openingHours);

      const response = await privateFetch(`/store/simulator`, {
        method: "POST",
        body: JSON.stringify({
          name: form.getValues("name"),
          isActive: form.getValues("isActive"),
          introduce: form.getValues("description"),
          storeId: form.getValues("storeId"),
          equipment: JSON.stringify(
            form
              .getValues("equipments")
              .map((e) => ({ name: e.label, isActive: e.selected })),
          ),
          openDays: form.getValues("openingDates").map((v, i) => ({
            startDay: v.start,
            endDay: v.end,
            sequence: i + 1,
          })),
          ...(form.formState.dirtyFields.openingHours
            ? {
                startTime: `${new Date().toISOString().slice(0, 10)}T${form.getValues("openingHours")?.start}`,
                endTime: `${new Date().toISOString().slice(0, 10)}T${form.getValues("openingHours")?.end}`,
                sequence: 1,
              }
            : {}),
          plans: form.getValues("plans")?.map((v, i) => ({
            title: v.title,
            hours: v.hours,
            price: v.price,
            sequence: i + 1,
          })),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const siteId = (await response.json()).id;

      const formData = new FormData();
      form
        .getValues("imageFiles")
        .forEach((img) => formData.append("image", img.file));

      await privateFetch(`/store/simulator/${siteId}/cover`, {
        method: "POST",
        body: formData,
      });
    },
    onSuccess() {
      toast.success("新增場地成功");
      navigate(
        linksKV["indoor-simulator"].subLinks["site-management"].paths.index
          .path + `/${form.getValues("storeId")}`,
      );
    },
    onError() {
      toast.error("新增場地失敗");
    },
  });

  if (!user!.permissions.includes("模擬器-基本操作"))
    stores = stores.filter((store) =>
      user!.allowedStores.simulator.includes(store.id),
    );

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
          <IconButton disabled={isPending} icon="save" form="site-details">
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
            formDisabled={isPending}
            stores={stores}
            onSubmit={() => mutate()}
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
