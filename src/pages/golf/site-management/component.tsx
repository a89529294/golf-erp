import { CategoryMain } from "@/components/category/category-main";
import { useAuth } from "@/hooks/use-auth";
import {
  genGolfStoresWithSitesQuery,
  loader,
} from "@/pages/golf/site-management/loader";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";

export function Component() {
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...genGolfStoresWithSitesQuery(
      user!.isAdmin ? "all" : user!.allowedStores.golf,
    ),
    initialData,
    staleTime: 5000,
  });

  return (
    <CategoryMain
      stores={stores}
      type="golf"
      newSiteHref={linksKV["golf"].subLinks["site-management"].paths.new}
      siteDetailsHref={`/golf/site-management/${storeId}`}
      earlyBirdPricingHref={`/golf/site-management/stores/early-bird-pricing/${storeId}`}
    />
  );
}
