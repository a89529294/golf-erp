import images from "@/temp/images.json";
import { queryClient } from "@/utils/query-client";
import { indoorSimulatorStoresQuery } from "../loader";

export const indoorSimulatorSiteQuery = {
  queryKey: ["indoor-simulator-site", "1"],
  queryFn: async () => {
    const site = {
      name: "123",
      description: "456",
      imageFiles: images,
      openingDates: [
        {
          id: "1",
          start: new Date("2023-01-01"),
          end: new Date("2023-01-02"),
          saved: true,
        },
      ],
      openingHours: [
        {
          id: "1",
          start: "12:00",
          end: "18:00",
          fee: 100,
          saved: true,
        },
        {
          id: "2",
          start: "08:00",
          end: "12:00",
          fee: 1000,
          saved: true,
        },
      ],
    };
    return site;
  },
};

export async function loader() {
  return {
    details: await queryClient.ensureQueryData(indoorSimulatorSiteQuery),
    stores: await queryClient.ensureQueryData(indoorSimulatorStoresQuery),
  };
}
