import { NewSiteDesktopMenubar } from "@/components/category/new-site-desktop-menubar";
import { NewSiteMobileMenubar } from "@/components/category/new-site-mobile-menubar";
import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { newDrivingRangeSchema } from "@/utils/category/schemas";
import { linksKV } from "@/utils/links";
import { SimpleStore } from "@/utils/types";
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
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...groundStoresQuery(user!.isAdmin ? "all" : user!.allowedStores.ground),
    initialData,
  });
  const form = useForm<z.infer<typeof newDrivingRangeSchema>>({
    resolver: zodResolver(newDrivingRangeSchema),
    defaultValues: {
      name: "",
      isActive: false,
      introduce: "",
      storeId: "",
      equipments: [],
      imageFiles: [],
      bannerImages: [],
      openingDates: [],
      venueSettings: [],
      costPerBox: 0,
      plans: [],
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-ground-site"],
    mutationFn: async () => {
      const v = form.getValues();
      const response = await privateFetch("/store/ground", {
        method: "POST",
        body: JSON.stringify({
          name: v.name,
          isActive: v.isActive,
          introduce: v.introduce,
          ballPrice: v.costPerBox,
          storeId: v.storeId,
          equipmentIds: form.getValues("equipments").map((e) => e.id),
          openDays: v.openingDates.map((od, idx) => ({
            sequence: idx + 1,
            startDay: od.start?.toISOString(),
            endDay: od.end?.toISOString(),
          })),
          openTimes: v.venueSettings.map((v, idx) => ({
            sequence: idx + 1,
            startTime: `${v.start}:00`,
            endTime: `${v.end}:00`,
          })),
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
      const data = await response.json();

      if (v.imageFiles.length) {
        const formData = new FormData();
        v.imageFiles.map((img) => formData.append("image", img.file));

        await privateFetch(`/store/ground/${data.id}/cover`, {
          method: "POST",
          body: formData,
        });
      }

      const bannerImages = form.getValues("bannerImages");
      if (bannerImages.length) {
        const formData2 = new FormData();
        bannerImages.forEach((img) => formData2.append("image", img.file));

        await privateFetch(`/store/ground/${data.id}/banner`, {
          method: "POST",
          body: formData2,
        });
      }
    },
    onSuccess: () => {
      navigate(
        linksKV["driving-range"]["subLinks"]["site-management"]["paths"][
          "index"
        ].path + `/${form.getValues("storeId")}`,
      );
      toast.success("新增場地");
    },
  });

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <NewSiteMobileMenubar
            isPending={isPending}
            onSave={async () => {
              const success = await form.trigger();
              if (success) mutate();
            }}
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
            type="driving-range"
            formDisabled={isPending}
            stores={stores as SimpleStore[]}
            onSubmit={() => mutate()}
            isPending={isPending}
          />
        </Form>
      </div>
    </MainLayout>
  );
}
