import images from "@/temp/images.json";
import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";
import { golfStoresQuery } from "../loader";

export const genGolfSiteDetailsQuery = (id: string) => ({
  queryKey: ["golf-site-details", id],
  queryFn: async () => {
    const obj = {
      name: "123",
      desc: "234",
      imageFiles: images,
      openingDates: [
        {
          id: "1",
          start: new Date("2022-01-01"),
          end: new Date("2023-01-01"),
          saved: true,
        },
      ],
      monday: [
        {
          id: "1",
          start: "00:00",
          end: "12:00",
          fee: 100,
          numberOfGroups: 10,
          numberOfGolfBalls: 100,
          subRows: [],
          saved: true,
        },
      ],
      tuesday: [],
      wednesday: [
        {
          id: "1",
          start: "00:00",
          end: "12:00",
          fee: 100,
          numberOfGroups: 10,
          numberOfGolfBalls: 100,
          subRows: [],
          saved: true,
        },
        {
          id: "2",
          start: "12:00",
          end: "23:59",
          fee: 100,
          numberOfGroups: 10,
          numberOfGolfBalls: 100,
          subRows: [],
          saved: true,
        },
      ],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    };
    return obj;
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    details: await queryClient.ensureQueryData(
      genGolfSiteDetailsQuery(params.id!),
    ),
    stores: await queryClient.ensureQueryData(golfStoresQuery),
  };
}
