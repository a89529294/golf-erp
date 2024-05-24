import { Site } from "@/components/category/site";
import { IconButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MainLayout } from "@/layouts/main-layout";
import {
  ExistingGolfCourse,
  existingGolfCourseSchema,
} from "@/utils/category/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { genGolfSiteDetailsQuery, loader } from "./loader";

export function Component() {
  const [formDisabled, setFormDisabled] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...genGolfSiteDetailsQuery(id!),
    initialData,
  });

  const form = useForm<ExistingGolfCourse>({
    resolver: zodResolver(existingGolfCourseSchema),
    defaultValues: {
      name: data.name,
      description: data.desc,
      imageFiles: data.imageFiles,
      openingDates: data.openingDates,
      monday: data.monday,
      tuesday: data.tuesday,
      wednesday: data.wednesday,
      thursday: data.thursday,
      friday: data.friday,
      saturday: data.saturday,
      sunday: data.sunday,
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
          建立場地資料
        </h1>
        <Form {...form}>
          <Site formDisabled={formDisabled} type={"golf"} />
        </Form>
      </div>
    </MainLayout>
  );
}
