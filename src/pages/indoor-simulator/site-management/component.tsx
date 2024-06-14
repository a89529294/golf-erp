import { CategoryMain } from "@/components/category/category-main";
import {
  indoorSimulatorStoresWithSitesQuery,
  loader,
} from "@/pages/indoor-simulator/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresWithSitesQuery,
    initialData,
  });
  return (
    <CategoryMain
      stores={stores}
      type="simulator"
      newSiteHref={
        linksKV["indoor-simulator"].subLinks["site-management"].paths.new
      }
      siteDetailsHref={`/indoor-simulator/site-management/${storeId}`}
    />
  );
}
