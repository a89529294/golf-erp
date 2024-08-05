import { CategoryMain } from "@/components/category/category-main";
import { useAuth } from "@/hooks/use-auth";
import {
  genGroundStoresWithSitesQuery,
  loader,
} from "@/pages/driving-range/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...genGroundStoresWithSitesQuery(
      user!.isAdmin ? "all" : user!.allowedStores.ground,
    ),
    initialData,
  });

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
