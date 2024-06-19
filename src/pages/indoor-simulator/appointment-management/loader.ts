import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { fromDateToDateTimeString } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

const appointmentsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(), // appointmentId
      startTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
      endTime: z.coerce.date().transform((v) => fromDateToDateTimeString(v)),
      storeSimulator: z.object({
        id: z.string(), // site id,
        name: z.string(),
        store: z.object({
          id: z.string(), // store id
        }),
      }),
      appUser: z.object({
        id: z.string(),
        chName: z.string(),
        phone: z.string(),
      }),
    }),
  ),
});

type StoreWithSiteAppointments = {
  id: string;
  sites: {
    id: string;
    name: string;
    appointments: {
      id: string;
      startTime: string;
      endTime: string;
      user: {
        id: string;
        name: string;
        phoneno: string;
      };
    }[];
  }[];
};

export type Appointment =
  StoreWithSiteAppointments["sites"][number]["appointments"][number];

export const appointmentsQuery = {
  queryKey: ["appointments", "simulator"],
  queryFn: async () => {
    const response = await privateFetch(
      "/appointment/simulator?populate=storeSimulator&populate=appUser&populate=storeSimulator.store&pageSize=999",
    );

    const data = await response.json();

    console.log(appointmentsSchema.safeParse(data));

    const parsedData = appointmentsSchema.parse(data);

    const storesWithSiteAppointments = [] as StoreWithSiteAppointments[];

    parsedData.data.forEach((appointment) => {
      const storeId = appointment.storeSimulator.store.id;
      const siteId = appointment.storeSimulator.id;
      const foundStore = storesWithSiteAppointments.find(
        (v) => v.id === storeId,
      );
      const transformedAppointment = {
        id: appointment.id,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        user: {
          id: appointment.appUser.id,
          name: appointment.appUser.chName,
          phoneno: appointment.appUser.phone,
        },
      };

      if (foundStore) {
        const foundSite = foundStore.sites.find((v) => v.id === siteId);

        if (foundSite) {
          foundSite.appointments.push(transformedAppointment);
        } else {
          foundStore.sites = [
            {
              id: appointment.storeSimulator.id,
              name: appointment.storeSimulator.name,
              appointments: [transformedAppointment],
            },
          ];
        }
      } else {
        storesWithSiteAppointments.push({
          id: appointment.storeSimulator.store.id,
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
    queryClient.ensureQueryData(indoorSimulatorStoresQuery),
    queryClient.ensureQueryData(appointmentsQuery),
  ] as const;

  const results = await Promise.all(promises);

  return {
    stores: results[0].map((v) => ({ id: v.id, name: v.name })),
    storesWithSiteAppointments: results[1],
  };
}
