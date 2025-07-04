import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import {
  simulatorAppoitmentsSchema,
  StoreWithSiteAppointments,
} from "@/types-and-schemas/appointment";
import { getAllowedStores } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { redirect } from "react-router-dom";

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
};

export type AppointmentsResponse = {
  storesWithSiteAppointments: StoreWithSiteAppointments[];
  pagination: PaginationMeta;
  sites: {
    id: string;
    name: string;
  }[];
};

export const appointmentsQuery = (
  page: number,
  pageSize: number,
  storeId: string,
  siteId: string,
  sortField?: string,
  sortOrder?: string,
) => ({
  queryKey: [
    "appointments",
    "simulator",
    storeId,
    siteId,
    page,
    sortField,
    sortOrder,
  ],
  queryFn: async () => {
    const x = await privateFetch(`/store/${storeId}/simulator`);
    const xx = (await x.json()).data as {
      id: string;
      name: string;
    }[];

    let url = `/appointment/simulator?populate=storeSimulator&populate=appUser&populate=storeSimulator.store&populate=order.invoice&populate=usedCoupon&page=${page}&pageSize=${pageSize}&filter[storeSimulator.store.id]=${storeId}${siteId === "all" ? "" : `&filter[storeSimulator.id]=${siteId}`}`;

    // Add sorting parameters if provided
    if (sortField && sortOrder) {
      url += `&sort=${sortField}&order=${sortOrder}`;
    }

    const response = await privateFetch(url);

    const data = await response.json();

    const parsedData = simulatorAppoitmentsSchema.parse(data);

    console.log(
      parsedData.data.filter((v) => v.order?.paymentMethod === "JKOPAY"),
    );

    const paginationMeta: PaginationMeta = {
      page,
      pageSize,
      pageCount: data.meta.pageCount,
    };

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

    // Return both the appointments data and pagination metadata
    return {
      storesWithSiteAppointments,
      pagination: paginationMeta,
      sites: xx,
    } as AppointmentsResponse;
  },
});

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // First handle missing page param
  if (!searchParams.get("page")) {
    searchParams.set("page", "1");
    throw redirect(`${url.pathname}?${searchParams.toString()}`);
  }

  // Then handle missing siteId
  if (!searchParams.get("siteId")) {
    searchParams.set("siteId", "all");
    throw redirect(`${url.pathname}?${searchParams.toString()}`);
  }

  const page = parseInt(searchParams.get("page")!);
  const siteId = searchParams.get("siteId")!;
  const stores = await queryClient.ensureQueryData(
    indoorSimulatorStoresQuery(await getAllowedStores("simulator")),
  );

  const storeId = searchParams.get("storeId") || stores[0].id;

  // Get sort parameters
  const sortField = searchParams.get("sortField") || "startTime";
  const sortOrder = searchParams.get("sortOrder") || "DESC";

  const appointmentsData = await queryClient.ensureQueryData({
    ...appointmentsQuery(page, 10, storeId, siteId, sortField, sortOrder),
  });

  return {
    stores: stores.map((v) => ({ id: v.id, name: v.name })),
    storesWithSiteAppointments: appointmentsData.storesWithSiteAppointments,
    pagination: appointmentsData.pagination,
    sites: appointmentsData.sites,
  };
}
