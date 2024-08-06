import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { memberSchema } from "../loader";

export const genMemberDetailsQuery = (id: string, storeId?: string) => ({
  queryKey: ["members", id, storeId],
  queryFn: async () => {
    const response = await privateFetch(
      `/app-users/${id}?populate=appChargeHistories&populate=storeAppUsers&populate=simulatorAppointmens&populate=groundAppointmens&populate=simulatorAppointments.order&populate=appChargeHistories.store&populate=simulatorAppointmens.storeSimulator.store`,
    );

    const data = await response.json();

    let parsedData = memberSchema.parse(data);

    if (storeId)
      parsedData = {
        ...parsedData,
        simulatorAppointmens: parsedData.simulatorAppointmens?.filter(
          (v) => v.storeSimulator.store.id === storeId,
        ),
        appChargeHistories: parsedData.appChargeHistories.filter(
          (v) => v.store.id === storeId,
        ),
      };

    return parsedData;
    // }
  },
});

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const storeId = url.searchParams.get("storeId") ?? undefined;
  return await queryClient.ensureQueryData(
    genMemberDetailsQuery(params.id!, storeId),
  );
}
