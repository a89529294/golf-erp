import AppExpenditureLevel from "@/pages/app-expenditure-level";
import AppPermissionManagement from "@/pages/app-permission-management";
import ClientManagement from "@/pages/client-management";
import DrivingRange from "@/pages/driving-range";
import Golf from "@/pages/golf";
import IndoorSimulator from "@/pages/indoor-simulator";
import MemberManagement from "@/pages/member-management";
import MemberProfiles from "@/pages/member-profiles";
import PersonnelDataManagement from "@/pages/personnel-data-management";
import Purchases from "@/pages/purchases";
import SystemOperationManagement from "@/pages/system-operation-management";
import { ReactElement } from "react";

export type FlatLink = {
  label: string;
  path: string;
  element: ReactElement;
  type: "flat";
};
export type NestedLink = {
  label: string;
  path: string;
  basePath: string;
  element: ReactElement;
  type: "nested";
  subLinks: FlatLink[];
};

type Links = (FlatLink | NestedLink)[];

const SYSTEM_MANAGEMENT_BASE_PATH = "/system-management";
const MEMBER_MANAGEMENT_BASE_PATH = "/member-management";

export const links: Links = [
  {
    label: "室內模擬器",
    path: "/indoor-simulator",
    element: <IndoorSimulator />,
    type: "flat" as const,
  },
  {
    label: "高爾夫球",
    path: "/golf",
    element: <Golf />,
    type: "flat" as const,
  },
  {
    label: "練習場",
    path: "/driving-range",
    element: <DrivingRange />,
    type: "flat" as const,
  },
  {
    label: "系統管理",
    type: "nested" as const,
    basePath: SYSTEM_MANAGEMENT_BASE_PATH,
    path: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-data-management`,
    element: <PersonnelDataManagement />,
    subLinks: [
      {
        label: "人員資料管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-data-management`,
        element: <PersonnelDataManagement />,
        type: "flat" as const,
      },
      {
        label: "APP消費級距",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-expenditure-level`,
        element: <AppExpenditureLevel />,
        type: "flat" as const,
      },
      {
        label: "系統操作管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/system-operation-management`,
        element: <SystemOperationManagement />,
        type: "flat" as const,
      },
      {
        label: "功能權限管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-permission-management`,
        element: <AppPermissionManagement />,
        type: "flat" as const,
      },
    ],
  },
  {
    label: "廠商管理",
    path: "/client-management",
    element: <ClientManagement />,
    type: "flat" as const,
  },
  {
    label: "會員管理",
    basePath: MEMBER_MANAGEMENT_BASE_PATH,
    path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
    element: <MemberManagement />,
    type: "nested" as const,
    subLinks: [
      {
        label: "查詢基本資料",
        path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
        element: <MemberProfiles />,
        type: "flat" as const,
      },
      {
        label: "儲值紀錄",
        path: `${MEMBER_MANAGEMENT_BASE_PATH}/purchases`,
        element: <Purchases />,
        type: "flat" as const,
      },
    ],
  },
];

export const isBelowLink = (prevPath: string, nextPath: string) => {
  return (
    links.findIndex((l) => l.path.startsWith(prevPath)) -
      links.findIndex((l) => l.path.startsWith(nextPath)) <
    0
  );
};
