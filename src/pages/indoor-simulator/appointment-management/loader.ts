import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import {
  simulatorAppoitmentsSchema,
  StoreWithSiteAppointments,
} from "@/types-and-schemas/appointment";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const appointmentsQuery = {
  queryKey: ["appointments", "simulator"],
  queryFn: async () => {
    const response = await privateFetch(
      "/appointment/simulator?populate=storeSimulator&populate=appUser&populate=storeSimulator.store&populate=order&populate=usedCoupon&pageSize=99999",
    );

    const data = await response.json();

    const parsedData = simulatorAppoitmentsSchema.parse(data);

    const storesWithSiteAppointments = [] as StoreWithSiteAppointments[];

    parsedData.data.forEach((appointment) => {
      const storeId = appointment.storeSimulator.store?.id;

      if (!storeId) {
        return;
      }

      const siteId = appointment.storeSimulator.id;
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
        discount: appointment.discount,
        originAmount: appointment.originAmount,
        usedCoupon: appointment.usedCoupon,
        order: appointment.order,
      };

      if (foundStore) {
        const foundSite = foundStore.sites.find((v) => v.id === siteId);

        if (foundSite) {
          foundSite.appointments.push(transformedAppointment);
        } else {
          foundStore.sites.push({
            id: appointment.storeSimulator.id,
            name: appointment.storeSimulator.name,
            appointments: [transformedAppointment],
          });
        }
      } else {
        storesWithSiteAppointments.push({
          id: storeId,
          sites: [
            {
              id: appointment.storeSimulator.id,
              name: appointment.storeSimulator.name,
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
      indoorSimulatorStoresQuery(await getAllowedStores("simulator")),
    ),
    queryClient.ensureQueryData(appointmentsQuery),
  ] as const;

  const results = await Promise.all(promises);

  return {
    stores: results[0].map((v) => ({ id: v.id, name: v.name })),
    storesWithSiteAppointments: results[1],
  };
}
