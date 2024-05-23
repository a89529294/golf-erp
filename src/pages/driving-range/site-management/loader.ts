import { queryClient } from "@/utils/query-client";

const sections = [
  {
    id: "1",
    name: "場地A",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    equipments: [
      {
        id: "1",
        label: "過山車電動麻將",
        selected: true,
      },
      {
        id: "2",
        label: "冷暖空調",
        selected: true,
      },
      {
        id: "3",
        label: "沙發",
        selected: true,
      },
      {
        id: "4",
        label: "VIP包廂",
        selected: true,
      },
      {
        id: "5",
        label: "茶几",
        selected: true,
      },
    ],
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
  {
    id: "2",
    name: "場地B",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    equipments: [
      {
        id: "1",
        label: "過山車電動麻將",
        selected: true,
      },
      {
        id: "2",
        label: "冷暖空調",
        selected: true,
      },
      {
        id: "3",
        label: "沙發",
        selected: true,
      },
      {
        id: "4",
        label: "VIP包廂",
        selected: true,
      },
      {
        id: "5",
        label: "茶几",
        selected: true,
      },
    ],
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
  {
    id: "3",
    name: "場地C",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    equipments: [
      {
        id: "1",
        label: "過山車電動麻將",
        selected: true,
      },
      {
        id: "2",
        label: "冷暖空調",
        selected: true,
      },
      {
        id: "3",
        label: "沙發",
        selected: true,
      },
      {
        id: "4",
        label: "VIP包廂",
        selected: true,
      },
      {
        id: "5",
        label: "茶几",
        selected: true,
      },
    ],
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
  {
    id: "4",
    name: "場地E",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    equipments: [
      {
        id: "1",
        label: "過山車電動麻將",
        selected: true,
      },
      {
        id: "2",
        label: "冷暖空調",
        selected: true,
      },
      {
        id: "3",
        label: "沙發",
        selected: true,
      },
      {
        id: "4",
        label: "VIP包廂",
        selected: true,
      },
      {
        id: "5",
        label: "茶几",
        selected: true,
      },
    ],
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
  {
    id: "5",
    name: "場地F",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    equipments: [
      {
        id: "1",
        label: "過山車電動麻將",
        selected: true,
      },
      {
        id: "2",
        label: "冷暖空調",
        selected: true,
      },
      {
        id: "3",
        label: "沙發",
        selected: true,
      },
      {
        id: "4",
        label: "VIP包廂",
        selected: true,
      },
      {
        id: "5",
        label: "茶几",
        selected: true,
      },
    ],
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

export const drivingRangeManagementQuery = {
  queryKey: ["indoor-simulator-index"],
  queryFn: async () => {
    return sections;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(drivingRangeManagementQuery);
}
