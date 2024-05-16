import { queryClient } from "@/utils/query-client";

const sections = [
  {
    id: "1",
    name: "場地A",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
];

export const golfSiteManagementQuery = {
  queryKey: ["golf-index"],
  queryFn: async () => {
    return sections;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(golfSiteManagementQuery);
}
