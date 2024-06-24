import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";
import { golfStoresQuery } from "../loader";
import { privateFetch } from "@/utils/utils";
import { Equipment, golfSitesSchema } from "@/utils/category/schemas";
import { getAllowedStores } from "@/utils";

export const genGolfSiteDetailsQuery = (storeId: string, siteId: string) => ({
  queryKey: ["golf-site-details", storeId, siteId],
  queryFn: async () => {
    const response = await privateFetch(`/store/${storeId}/golf?populate=*`);
    const data = await response.json();

    const parsed = golfSitesSchema.parse(data);

    const site = parsed.data.find((p) => p.id === siteId);

    if (!site) throw new Error(`site non existent, id: ${siteId}`);

    return {
      ...site,
      openDays: site.openDays?.map((od) => ({
        id: od.id,
        start: new Date(od.startDay),
        end: new Date(od.endDay),
        saved: true,
      })),
      coverImages: site.coverImages.map((img) => ({
        id: img,
        src: img,
      })),
      equipments: (JSON.parse(site.equipment ?? "[]") as Equipment[]).map(
        (e) => ({
          id: crypto.randomUUID(),
          label: e.name,
          selected: e.isActive,
        }),
      ),
      openTimes: (site.openTimes ?? []).map((ot) => ({
        id: ot.id,
        day: ot.day,
        title: ot.title,
        start: ot.startTime.slice(11, 16),
        end: ot.endTime.slice(11, 16),
        saved: true,
        numberOfGroups: ot.openQuantity,
        subRows: ot.pricePerHour.map((o) => ({
          id: crypto.randomUUID(),
          memberLevel: o.membershipType,
          partyOf1Fee: o["1"],
          partyOf2Fee: o["2"],
          partyOf3Fee: o["3"],
          partyOf4Fee: o["4"],
        })),
      })),
      store: site.store!,
    };
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  const r = await getAllowedStores("golf");

  return {
    details: await queryClient.ensureQueryData(
      genGolfSiteDetailsQuery(params.storeId!, params.siteId!),
    ),
    stores: await queryClient.ensureQueryData(golfStoresQuery(r)),
  };
}
