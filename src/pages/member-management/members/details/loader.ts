import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { memberSchema } from "../loader";
import queryString from "query-string";

export const genMemberDetailsQuery = (id: string, storeId?: string) => ({
  queryKey: ["members", id, storeId],
  queryFn: async () => {
    const queryObject: Record<string, string[]> = {};

    queryObject.populate = [
      "storeAppUsers",
      "appChargeHistories.store",
      "appUserCoupons.store",
      // "simulatorAppointmens.storeSimulator.store",
      "groundAppointmens",
    ];

    const response = await privateFetch(
      `/app-users/${id}?${queryString.stringify(queryObject)}`,
    );

    const data = await response.json();

    let parsedData = memberSchema.parse(data);

    if (storeId)
      parsedData = {
        ...parsedData,
        simulatorAppointmens:
          parsedData.simulatorAppointmens?.filter(
            (v) => v.storeSimulator.store.id === storeId,
          ) ?? [],
        appChargeHistories: parsedData.appChargeHistories.filter(
          (v) => v.store.id === storeId,
        ),
        appUserCoupons:
          parsedData.appUserCoupons?.filter((v) => v.store?.id === storeId) ??
          [],
      };

    return parsedData;
    // }
  },
  staleTime: 1000 * 5,
});

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const storeId = url.searchParams.get("storeId") ?? undefined;
  return await queryClient.ensureQueryData(
    genMemberDetailsQuery(params.id!, storeId),
  );
}
