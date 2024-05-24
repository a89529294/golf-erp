import images from "@/temp/images.json";
import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";

export const genDrivingRangeDetailsQuery = (id: string) => ({
  queryKey: ["driving-range-details", id],
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
      venueSettings: [
        {
          id: "1",
          start: "11:00",
          end: "12:00",
          fee: 100,
          numberOfGroups: 1,
          numberOfBalls: 10,
          saved: true,
        },
      ],
      costPerBox: 22,
    };
    return obj;
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return await queryClient.ensureQueryData(
    genDrivingRangeDetailsQuery(params.id!),
  );
}
