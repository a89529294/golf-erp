import { groundStoresQuery } from "@/pages/driving-range/site-management/loader";
import {
  StoreWithSiteAppointments,
  groundAppoitmentsSchema,
} from "@/types-and-schemas/appointment";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const genAppointmentsQuery = (
  storeId: string,
  siteId: string,
  page: number,
) => ({
  queryKey: ["appointments", "ground", storeId, siteId, page],
  queryFn: async () => {
    const response = await privateFetch(
      `/appointment/ground?populate=storeGround&populate=appUser&populate=storeGround.store&populate=order&populate=usedCoupon&filter[storeGround.store.id]=${storeId}${siteId === "all" ? "" : `&filter[storeGround.id]=${siteId}`}&pageSize=10&page=${page}`,
    );

    const data = await response.json();

    const parsedData = groundAppoitmentsSchema.parse(data);

    const storesWithSiteAppointments = [] as StoreWithSiteAppointments[];

    parsedData.data.forEach((appointment) => {
      const storeId = appointment.storeGround.store?.id;

      if (!storeId) {
        return;
      }

      const siteId = appointment.storeGround.id;
      const foundStore = storesWithSiteAppointments.find(
        (v) => v.id === storeId,
      );
      const transformedAppointment = {
        id: appointment.id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        appUser: appointment.appUser
          ? {
              id: appointment.appUser.id,
              chName: appointment.appUser.chName,
              phone: appointment.appUser.phone,
            }
          : undefined,
        status: appointment.status,
        amount: appointment.amount,
      };

      if (foundStore) {
        const foundSite = foundStore.sites.find((v) => v.id === siteId);

        if (foundSite) {
          foundSite.appointments.push(transformedAppointment);
        } else {
          foundStore.sites = [
            {
              id: appointment.storeGround.id,
              name: appointment.storeGround.name,
              appointments: [transformedAppointment],
            },
          ];
        }
      } else {
        storesWithSiteAppointments.push({
          id: storeId,
          sites: [
            {
              id: appointment.storeGround.id,
              name: appointment.storeGround.name,
              appointments: [transformedAppointment],
            },
          ],
        });
      }
    });

    return {
      data: storesWithSiteAppointments,
      meta: parsedData.meta,
    };
  },
});

export async function loader() {
  const promises = [
    queryClient.ensureQueryData(
      groundStoresQuery(await getAllowedStores("ground")),
    ),
    // queryClient.ensureQueryData(appointmentsQuery),
  ] as const;

  const results = await Promise.all(promises);

  return {
    stores: results[0].map((v) => ({ id: v.id, name: v.name })),
    // storesWithSiteAppointments: results[1],
  };
}
