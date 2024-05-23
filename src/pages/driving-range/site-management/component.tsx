import { CategoryMain } from "@/components/category/category-main";
import {
  drivingRangeManagementQuery,
  loader,
} from "@/pages/driving-range/site-management/loader";
import { linksKV } from "@/utils/links";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <CategoryMain
      initialData={initialData}
      queryObject={drivingRangeManagementQuery}
      newSiteHref={
        linksKV["driving-range"].subLinks["site-management"].paths.new
      }
      siteDetailsHref="/driving-range/site-management/details/"
    />
  );
}
