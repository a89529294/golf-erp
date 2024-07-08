import { groundStoresQuery } from "@/pages/driving-range/site-management/loader";
import {
  StoreWithSiteAppointments,
  groundAppoitmentsSchema,
} from "@/types-and-schemas/appointment";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const appointmentsQuery = {
  queryKey: ["appointments", "ground"],
  queryFn: async () => {
    const response = await privateFetch(
      "/appointment/ground?populate=storeGround&populate=appUser&populate=storeGround.store&pageSize=999",
    );

    const data = await response.json();

    const parsedData = groundAppoitmentsSchema.parse(data);

    const storesWithSiteAppointments = [] as StoreWithSiteAppointments[];

    parsedData.data.forEach((appointment) => {
      const storeId = appointment.storeGround.store.id;
      const siteId = appointment.storeGround.id;
      const foundStore = storesWithSiteAppointments.find(
        (v) => v.id === storeId,
      );
      const transformedAppointment = {
        id: appointment.id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        appUser: {
          id: appointment.appUser.id,
          chName: appointment.appUser.chName,
          phone: appointment.appUser.phone,
        },
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
          id: appointment.storeGround.store.id,
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

    return storesWithSiteAppointments;
  },
};

export async function loader() {
  const promises = [
    queryClient.ensureQueryData(
      groundStoresQuery(await getAllowedStores("ground")),
    ),
    queryClient.ensureQueryData(appointmentsQuery),
  ] as const;

  const results = await Promise.all(promises);

  return {
    stores: results[0].map((v) => ({ id: v.id, name: v.name })),
    storesWithSiteAppointments: results[1],
  };
}
