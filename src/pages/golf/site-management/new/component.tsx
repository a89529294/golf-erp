import { NewSite } from "@/components/category/new-site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import {
  NewGolfSite,
  newGolfSiteSchema,
} from "@/pages/golf/site-management/new/schemas";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function Component() {
  const navigate = useNavigate();
  const form = useForm<NewGolfSite>({
    resolver: zodResolver(newGolfSiteSchema),
    defaultValues: {
      name: "",
      description: "",
      imageFiles: [],
      openingDates: [],
      openingHours: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
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
          <NewSite />
        </Form>
      </div>
    </MainLayout>
  );
}
