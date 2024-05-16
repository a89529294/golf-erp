import { CategoryMain } from "@/components/category/category-main";
import {
  golfSiteManagementQuery,
  loader,
} from "@/pages/golf/site-management/loader";
import { linksKV } from "@/utils/links";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <CategoryMain
      initialData={initialData}
      queryObject={golfSiteManagementQuery}
      newSiteHref={linksKV["golf"].subLinks["site-management"].paths.new}
      siteDetailsHref="/golf/site-management/details/"
    />
  );
}
