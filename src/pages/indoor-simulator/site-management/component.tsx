import { CategoryMain } from "@/components/category/category-main";
import { useAuth } from "@/hooks/use-auth";
import {
  indoorSimulatorStoresWithSitesQuery,
  loader,
} from "@/pages/indoor-simulator/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let { data: stores } = useQuery({
    ...indoorSimulatorStoresWithSitesQuery,
    initialData,
  });

  // if user has access to this page but does not have permisson, it means he is an employee of at least one ground store
  if (!user!.permissions.includes("模擬器-基本操作"))
    stores = stores.filter((store) =>
      user!.allowedStores.simulator.includes(store.id),
    );

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
