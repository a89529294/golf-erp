import { CategoryMain } from "@/components/category/category-main";
import { golfStoresQuery, loader } from "@/pages/golf/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...golfStoresQuery,
    initialData,
  });
  return (
    <CategoryMain
      stores={stores}
      type="golf"
      newSiteHref={linksKV["golf"].subLinks["site-management"].paths.new}
      siteDetailsHref="/golf/site-management/details/"
    />
  );
}
