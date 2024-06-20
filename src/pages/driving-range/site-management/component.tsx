import { CategoryMain } from "@/components/category/category-main";
import { useAuth } from "@/hooks/use-auth";
import {
  groundStoresWithSitesQuery,
  loader,
} from "@/pages/driving-range/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let { data: stores } = useQuery({
    ...groundStoresWithSitesQuery,
    initialData,
  });

  // if user has access to this page but does not have permisson, it means he is an employee of at least one ground store
  if (!user!.permissions.includes("練習場-基本操作"))
    stores = stores.filter((store) =>
      user!.allowedStores.ground.includes(store.id),
    );

  return (
    <CategoryMain
      type="ground"
      newSiteHref={
        linksKV["driving-range"].subLinks["site-management"].paths.new
      }
      siteDetailsHref={`/driving-range/site-management/${storeId}`}
      stores={stores}
    />
  );
}
