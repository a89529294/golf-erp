import { groundStoresQuery } from "@/pages/driving-range/site-management/loader";
import {
  StoreWithSiteAppointments,
  groundAppoitmentsSchema,
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
    "ground",
    storeId,
    siteId,
    page,
    sortField,
    sortOrder,
  ],
  queryFn: async () => {
    // Fetch sites for the store
    const sitesResponse = await privateFetch(`/store/${storeId}/ground`);
    const sites = (await sitesResponse.json()).data as {
      id: string;
      name: string;
    }[];

    // Build the URL with pagination, filtering and sorting
    let url = `/appointment/ground?populate=storeGround&populate=appUser&populate=storeGround.store&populate=order&page=${page}&pageSize=${pageSize}&filter[storeGround.store.id]=${storeId}${siteId === "all" ? "" : `&filter[storeGround.id]=${siteId}`}`;

    // Add sorting parameters if provided
    if (sortField && sortOrder) {
      url += `&sort=${sortField}&order=${sortOrder}`;
    }

    const response = await privateFetch(url);
    const data = await response.json();
    const parsedData = groundAppoitmentsSchema.parse(data);

    // Extract pagination metadata from response
    const paginationMeta: PaginationMeta = {
      page,
      pageSize,
      pageCount: data.meta.pageCount,
    };

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
        updatedAt: appointment.updatedAt,
        appUser: appointment.appUser
          ? {
              id: appointment.appUser.id,
              chName: appointment.appUser.chName,
              phone: appointment.appUser.phone,
            }
          : undefined,
        status: appointment.status,
        amount: appointment.amount,
        order: appointment.order,
      };

      if (foundStore) {
        const foundSite = foundStore.sites.find((v) => v.id === siteId);

        if (foundSite) {
          foundSite.appointments.push(transformedAppointment);
        } else {
          foundStore.sites.push({
            id: appointment.storeGround.id,
            name: appointment.storeGround.name,
            appointments: [transformedAppointment],
          });
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

    // Return both the appointments data and pagination metadata
    return {
      storesWithSiteAppointments,
      pagination: paginationMeta,
      sites,
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
    groundStoresQuery(await getAllowedStores("ground")),
  );

  const storeId = searchParams.get("storeId") || stores[0].id;

  // Get sort parameters
  const sortField = searchParams.get("sortField") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;

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
