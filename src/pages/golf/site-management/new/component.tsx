import { Site } from "@/components/category/site";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import { NewGolfCourse, newGolfCourseSchema } from "@/utils/category/schemas";

import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { NewDesktopMenubar } from "@/pages/golf/site-management/components/new-desktop-menubar";
import { NewMobileMenubar } from "@/pages/golf/site-management/components/new-mobile-menubar";
import { privateFetch } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { golfStoresQuery } from "../loader";
import { loader } from "./loader";

export function Component() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...golfStoresQuery(user!.isAdmin ? "all" : user!.allowedStores.golf),
    initialData,
  });
  const form = useForm<NewGolfCourse>({
    resolver: zodResolver(newGolfCourseSchema),
    defaultValues: {
      name: "",
      isActive: false,
      description: "",
      equipments: equipments,
      imageFiles: [],
      openingDates: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-new-golf-site"],
    mutationFn: async () => {
      const v = form.getValues();
      const body = JSON.stringify({
        name: v.name,
        isActive: v.isActive,
        introduce: v.description,
        equipment: JSON.stringify(
          v.equipments.map((e) => ({
            name: e.label,
            isActive: e.selected,
          })),
        ),
        storeId: v.storeId,
        openDays: v.openingDates.map((od, idx) => ({
          sequence: idx + 1,
          startDay: od.start?.toISOString(),
          endDay: od.end?.toISOString(),
        })),
        openTimes: [
          v.sunday,
          v.monday,
          v.tuesday,
          v.wednesday,
          v.thursday,
          v.friday,
          v.saturday,
        ].flatMap((day, idx) => {
          return day.map((d, index) => {
            return {
              day: idx,
              title: d.title,
              startTime: `2023-01-01T${d.start}`,
              endTime: `2023-01-01T${d.end}`,
              openQuantity: d.numberOfGroups,
              sequence: index + 1,
              pricePerHour: JSON.stringify(
                d.subRows.map((v) => {
                  return {
                    membershipType: v.memberLevel,
                    1: v.partyOf1Fee,
                    2: v.partyOf2Fee,
                    3: v.partyOf3Fee,
                    4: v.partyOf4Fee,
                  };
                }),
              ),
            };
          });
        }),
      });

      const response = await privateFetch("/store/golf", {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { id } = (await response.json()) as { id: string };

      if (v.imageFiles.length) {
        const formData = new FormData();
        v.imageFiles.forEach((file) => formData.append("image", file.file));

        await privateFetch(`/store/golf/${id}/cover`, {
          method: "POST",
          body: formData,
        });
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["sites-for-store"],
      });
      toast.success("新增高爾夫場地");
      navigate(`/golf/site-management/${form.getValues("storeId")}`);
    },
    onError() {
      toast.error("無法新增高爾夫場地");
    },
  });

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <NewMobileMenubar isPending={isPending} onSave={mutate} />
        ) : (
          <NewDesktopMenubar isPending={isPending} />
        )
      }
    >
      <div className="flex w-full flex-col gap-10 border border-line-gray bg-light-gray p-1">
        <h1 className="bg-mid-gray py-2.5 text-center text-black">
          建立場地資料
        </h1>
        <Form {...form}>
          <Site
            type="golf"
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
