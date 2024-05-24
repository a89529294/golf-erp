import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import { equipments } from "@/utils/category/equipment";
import { newDrivingRangeSchema } from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export function Component() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof newDrivingRangeSchema>>({
    resolver: zodResolver(newDrivingRangeSchema),
    defaultValues: {
      name: "",
      description: "",
      equipments: equipments,
      imageFiles: [],
      openingDates: [],
      venueSettings: [],
      costPerBox: 0,
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
          <Site type="driving-range" formDisabled={false} />
        </Form>
      </div>
    </MainLayout>
  );
}