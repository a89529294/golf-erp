import { NewSiteDesktopMenubar } from "@/components/category/new-site-desktop-menubar";
import { NewSiteMobileMenubar } from "@/components/category/new-site-mobile-menubar";
import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
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

export function Component() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
    initialData,
  });
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newIndoorSimulatorSchema>>({
    resolver: zodResolver(newIndoorSimulatorSchema),
    defaultValues: {
      name: "",
      isActive: false,
      introduce: "",
      equipments: [],
      imageFiles: [],
      bannerImages: [],
      openingDates: [],
      openingHours: [],
      plans: [],
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-indoor-simulator-site"],
    mutationFn: async () => {
      const response = await privateFetch(`/store/simulator`, {
        method: "POST",
        body: JSON.stringify({
          name: form.getValues("name"),
          isActive: form.getValues("isActive"),
          introduce: form.getValues("introduce"),
          storeId: form.getValues("storeId"),
          equipmentIds: form.getValues("equipments").map((e) => e.id),
          openDays: form.getValues("openingDates").map((v, i) => ({
            startDay: v.start,
            endDay: v.end,
            sequence: i + 1,
          })),
          ...(form.formState.dirtyFields.openingHours
            ? {
                openTimes: [
                  {
                    startTime: form.getValues("openingHours")[0]?.start,
                    endTime: form.getValues("openingHours")[0]?.end,
                    sequence: 1,
                  },
                ],
              }
            : {
                openTimes: [],
              }),
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

      const imageFiles = form.getValues("imageFiles");
      if (imageFiles.length) {
        const formData = new FormData();
        imageFiles.forEach((img) => formData.append("image", img.file));

        await privateFetch(`/store/simulator/${siteId}/cover`, {
          method: "POST",
          body: formData,
        });
      }

      const bannerImages = form.getValues("bannerImages");
      if (bannerImages.length) {
        const formData2 = new FormData();
        bannerImages.forEach((img) => formData2.append("image", img.file));

        await privateFetch(`/store/simulator/${siteId}/banner`, {
          method: "POST",
          body: formData2,
        });
      }
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

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <NewSiteMobileMenubar
            onSave={async () => {
              const success = await form.trigger();
              if (success) mutate();
            }}
            isPending={isPending}
          />
        ) : (
          <NewSiteDesktopMenubar isPending={isPending} />
        )
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
            onSubmit={() => {
              mutate();
            }}
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
