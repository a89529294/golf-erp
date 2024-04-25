import { ErrorElement } from "@/components/error-element";
import AppExpenditureLevel from "@/pages/app-expenditure-level";
import AppPermissionManagement from "@/pages/app-permission-management";
import ClientManagement from "@/pages/client-management";
import DrivingRange from "@/pages/driving-range";
import Golf from "@/pages/golf";
import IndoorSimulator from "@/pages/indoor-simulator";
import MemberProfiles from "@/pages/member-profiles";
import NewEmployee from "@/pages/new-employee";
import PersonnelDataManagement from "@/pages/personnel-data-management";
import { loader as personnelDataManagementLoader } from "@/pages/personnel-data-management/loader";
import Purchases from "@/pages/purchases";
import SystemOperationManagement from "@/pages/system-operation-management";
import { ReactElement } from "react";
import { type LoaderFunction } from "react-router-dom";

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
  // element: ReactElement;
  type: "nested";
  subLinks: { [key: string]: FlatLink | MultipleLink };
};
export type MultipleLink = {
  label: string;
  paths: { [key: string]: string };
  elements: { [key: string]: ReactElement };
  loaders: { [key: string]: () => Promise<unknown> };
  type: "multiple";
};

const SYSTEM_MANAGEMENT_BASE_PATH = "/system-management";
const MEMBER_MANAGEMENT_BASE_PATH = "/member-management";

export const linksKV = {
  "indoor-simulator": {
    label: "室內模擬器",
    path: "/indoor-simulator",
    element: <IndoorSimulator />,
    type: "flat" as const,
  },
  golf: {
    label: "高爾夫球",
    path: "/golf",
    element: <Golf />,
    type: "flat" as const,
  },
  "driving-range": {
    label: "練習場",
    path: "/driving-range",
    element: <DrivingRange />,
    type: "flat" as const,
  },
  "data-management": {
    label: "系統管理",
    type: "nested" as const,
    basePath: SYSTEM_MANAGEMENT_BASE_PATH,
    path: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-data-management`,
    subLinks: {
      "personnel-data-management": {
        label: "人員資料管理",
        paths: {
          index: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-data-management`,
          new: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-data-management/new-employee`,
        },
        elements: { index: <PersonnelDataManagement />, new: <NewEmployee /> },
        loaders: { index: personnelDataManagementLoader } as Record<
          string,
          LoaderFunction
        >,
        errorElements: {
          index: <ErrorElement />,
        } as Record<string, ReactElement>,
        type: "multiple" as const,
      },
      "app-expenditure-level": {
        label: "APP消費級距",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-expenditure-level`,
        element: <AppExpenditureLevel />,
        type: "flat" as const,
      },
      "system-operation-management": {
        label: "系統操作管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/system-operation-management`,
        element: <SystemOperationManagement />,
        type: "flat" as const,
      },
      "app-permission-management": {
        label: "功能權限管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-permission-management`,
        element: <AppPermissionManagement />,
        type: "flat" as const,
      },
    },
  },
  "client-management": {
    label: "廠商管理",
    path: "/client-management",
    element: <ClientManagement />,
    type: "flat" as const,
  },
  "member-management": {
    label: "會員管理",
    basePath: MEMBER_MANAGEMENT_BASE_PATH,
    path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
    type: "nested" as const,
    subLinks: {
      profiles: {
        label: "查詢基本資料",
        path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
        element: <MemberProfiles />,
        type: "flat" as const,
      },
      purchases: {
        label: "儲值紀錄",
        path: `${MEMBER_MANAGEMENT_BASE_PATH}/purchases`,
        element: <Purchases />,
        type: "flat" as const,
      },
    },
  },
};

export const links = Object.values(linksKV);

export const isBelowLink = (prevPath: string, nextPath: string) => {
  return (
    links.findIndex((l) => l.path.startsWith(prevPath)) -
      links.findIndex((l) => l.path.startsWith(nextPath)) <
    0
  );
};

export const findLinkFromPathname = (pathname: string) =>
  links.find((link) =>
    pathname.startsWith(link.type === "nested" ? link.basePath : link.path),
  );
