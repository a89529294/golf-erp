import { CategoryMain } from "@/components/category/category-main";
import {
  indoorSimulatorSiteManagementQuery,
  loader,
} from "@/pages/indoor-simulator/site-management/loader";
import { linksKV } from "@/utils/links";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <CategoryMain
      initialData={initialData}
      queryObject={indoorSimulatorSiteManagementQuery}
      newSiteHref={
        linksKV["indoor-simulator"].subLinks["site-management"].paths.new
      }
      siteDetailsHref="/indoor-simulator/site-management/details/"
    />
  );
}
