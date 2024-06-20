import { CategoryMain } from "@/components/category/category-main";
import { useAuth } from "@/hooks/use-auth";
import {
  golfStoresWithSitesQuery,
  loader,
} from "@/pages/golf/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  let { data: stores } = useQuery({
    ...golfStoresWithSitesQuery,
    initialData,
  });

  // if user has access to this page but does not have permisson, it means he is an employee of at least one golf store
  if (!user!.permissions.includes("高爾夫球-基本操作"))
    stores = stores.filter((store) =>
      user!.allowedStores.golf.includes(store.id),
    );

  return (
    <CategoryMain
      stores={stores}
      type="golf"
      newSiteHref={linksKV["golf"].subLinks["site-management"].paths.new}
      siteDetailsHref={`/golf/site-management/${storeId}`}
    />
  );
}
