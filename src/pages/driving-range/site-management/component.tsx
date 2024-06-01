import { CategoryMain } from "@/components/category/category-main";
import {
  groundStoresQuery,
  loader,
} from "@/pages/driving-range/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...groundStoresQuery,
    initialData,
  });

  return (
    <CategoryMain
      type="ground"
      newSiteHref={
        linksKV["driving-range"].subLinks["site-management"].paths.new
      }
      siteDetailsHref="/driving-range/site-management/details/"
      stores={stores}
    />
  );
}
