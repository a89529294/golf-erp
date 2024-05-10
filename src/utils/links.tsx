import { LazyRouteFunction, NonIndexRouteObject } from "react-router-dom";

export type FlatLink = {
  label: string;
  path: string;
  lazy: LazyRouteFunction<NonIndexRouteObject>;
  type: "flat";
  allowedPermissions: string[];
};
export type NestedLink = {
  label: string;
  path: string;
  basePath: string;
  // element: ReactElement;
  type: "nested";
  subLinks: Record<string, FlatLink | MultipleLink>;
  allowedPermissions: string[];
};
export type MultipleLink = {
  label: string;
  paths: Record<string, string>;
  lazy: Record<string, LazyRouteFunction<NonIndexRouteObject>>;
  type: "multiple";
  allowedPermissions: string[];
};

const INDOOR_SIMULATOR_BASE_PATH = "/indoor-simulator";
const GOLF_BASE_PATH = "/golf";
const DRIVING_RANGE_BASE_PATH = "/driving-range";
const SYSTEM_MANAGEMENT_BASE_PATH = "/system-management";
// const MEMBER_MANAGEMENT_BASE_PATH = "/member-management";

export const permissionsList = {
  "indoor-simulator": {
    "basic-operations": "模擬器-基本操作",
    report: "模擬器-報表",
  },
  golf: {
    "basic-operations": "高爾夫球-基本操作",
    report: "高爾夫球-報表",
  },
  "driving-range": {
    "basic-operations": "練習場-基本操作",
    report: "練習場-報表",
  },
  "system-management": "管理系統",
};

// if you add/remove new nested links you must also modify
// src/index.tsx and sidebar.tsx
export const linksKV = {
  "driving-range": {
    label: "練習場",
    type: "nested" as const,
    basePath: DRIVING_RANGE_BASE_PATH,
    path: `${DRIVING_RANGE_BASE_PATH}/basic-operations`,
    allowedPermissions: ["練習場-基本操作", "練習場-報表"],
    subLinks: {
      "basic-operations": {
        label: "基本操作",
        path: `${DRIVING_RANGE_BASE_PATH}/basic-operations`,
        lazy: () => import("@/pages/driving-range/basic-operations"),
        type: "flat" as const,
        allowedPermissions: ["練習場-基本操作"],
      },
      report: {
        label: "報表",
        path: `${DRIVING_RANGE_BASE_PATH}/report`,
        lazy: () => import("@/pages/driving-range/report"),
        type: "flat" as const,
        allowedPermissions: ["練習場-報表"],
      },
    },
  },

  golf: {
    label: "高爾夫球",
    type: "nested" as const,
    basePath: GOLF_BASE_PATH,
    path: `${GOLF_BASE_PATH}/basic-operations`,
    allowedPermissions: ["高爾夫球-基本操作", "高爾夫球-報表"],
    subLinks: {
      "basic-operations": {
        label: "基本操作",
        path: `${GOLF_BASE_PATH}/basic-operations`,
        lazy: () => import("@/pages/golf/basic-operations"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-基本操作"],
      },
      report: {
        label: "報表",
        path: `${GOLF_BASE_PATH}/report`,
        lazy: () => import("@/pages/golf/report"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-報表"],
      },
    },
  },
  "indoor-simulator": {
    label: "室內模擬器",
    type: "nested" as const,
    basePath: INDOOR_SIMULATOR_BASE_PATH,
    path: `${INDOOR_SIMULATOR_BASE_PATH}/member-management`,
    allowedPermissions: ["模擬器-基本操作", "模擬器-報表"],
    subLinks: {
      "member-management": {
        label: "會員管理",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/member-management`,
        lazy: () => import("@/pages/indoor-simulator/member-management"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-基本操作"],
      },
      "site-management": {
        label: "場地管理",
        paths: {
          index: `${INDOOR_SIMULATOR_BASE_PATH}/site-management`,
          new: `${INDOOR_SIMULATOR_BASE_PATH}/site-management/new`,
          details: `${INDOOR_SIMULATOR_BASE_PATH}/site-management/details`,
        },
        lazy: {
          index: () => import("@/pages/indoor-simulator/site-management"),
          new: () => import("@/pages/indoor-simulator/site-management/new"),
          details: () =>
            import("@/pages/indoor-simulator/site-management/details"),
        },
        type: "multiple" as const,
        allowedPermissions: ["模擬器-基本操作"],
      },
      "appointment-management": {
        label: "預約管理",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/appointment-management`,
        lazy: () => import("@/pages/indoor-simulator/appointment-management"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-基本操作"],
      },
      "repair-report": {
        label: "報修回報",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/repair-report`,
        lazy: () => import("@/pages/indoor-simulator/repair-report"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-基本操作"],
      },
      report: {
        label: "報表",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/report`,
        lazy: () => import("@/pages/indoor-simulator/report"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-報表"],
      },
    },
  },

  "system-management": {
    label: "系統管理",
    type: "nested" as const,
    basePath: SYSTEM_MANAGEMENT_BASE_PATH,
    path: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management`,
    allowedPermissions: ["管理系統"],
    subLinks: {
      "personnel-system-management": {
        label: "人員資料管理",
        paths: {
          index: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management`,
          new: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management/new-employee`,
        },
        lazy: {
          index: () => import("@/pages/system-management/personnel-management"),
          new: () =>
            import(
              "@/pages/system-management/personnel-management/new-employee"
            ),
        },
        type: "multiple" as const,
        allowedPermissions: ["管理系統"],
      },
      "system-operation-management": {
        label: "系統操作管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/system-operation-management`,
        lazy: () =>
          import("@/pages/system-management/system-operation-management"),
        type: "flat" as const,
        allowedPermissions: ["管理系統"],
      },
      "app-permission-management": {
        label: "功能權限管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-permission-management`,
        lazy: () =>
          import("@/pages/system-management/app-permission-management"),
        type: "flat" as const,
        allowedPermissions: ["管理系統"],
      },
      "app-expenditure-level": {
        label: "APP消費級距",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-expenditure-level`,
        lazy: () => import("@/pages/system-management/app-expenditure-level"),
        type: "flat" as const,
        allowedPermissions: ["管理系統"],
      },
    },
  },
  "store-management": {
    label: "廠商管理",
    paths: {
      index: "/store-management",
      new: "/store-management/new",
      details: "/store-management/details/:storeId",
    },
    lazy: {
      index: () => import("@/pages/store-management"),
      new: () => import("@/pages/store-management/new"),
      details: () => import("@/pages/store-management/details"),
    },
    type: "multiple" as const,
    allowedPermissions: ["廠商管理"],
  },
  // "member-management": {
  //   label: "會員管理",
  //   basePath: MEMBER_MANAGEMENT_BASE_PATH,
  //   path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
  //   type: "nested" as const,
  //   subLinks: {
  //     profiles: {
  //       label: "查詢基本資料",
  //       path: `${MEMBER_MANAGEMENT_BASE_PATH}/member-profiles`,
  //       lazy: () => import("@/pages/member-profiles"),
  //       type: "flat" as const,
  //     },
  //     purchases: {
  //       label: "儲值紀錄",
  //       path: `${MEMBER_MANAGEMENT_BASE_PATH}/purchases`,
  //       lazy: () => import("@/pages/purchases"),
  //       type: "flat" as const,
  //     },
  //   },
  // },
};
// } satisfies Record<string, FlatLink | NestedLink>;

const links = Object.values(linksKV);

export const isBelowLink = (prevPath: string, nextPath: string) => {
  const getPath = (link: NestedLink | MultipleLink) =>
    link.type === "nested" ? link.path : link.paths.index;

  return (
    links.findIndex((l) => getPath(l).startsWith(prevPath)) -
      links.findIndex((l) => getPath(l).startsWith(nextPath)) <
    0
  );
};

export const findLinkFromPathname = (
  pathname: string,
): NestedLink | MultipleLink | undefined =>
  links.find((link) =>
    link.type === "nested"
      ? pathname.startsWith(link.basePath)
      : pathname.startsWith(link.paths.index),
  );

export const sameRouteGroup = (path: string, nextPath: string) => {
  const getSubPaths = (s: keyof typeof linksKV) => {
    const obj = linksKV[s];
    if (obj.type === "multiple") return [];

    return Object.values(obj.subLinks).flatMap((subLink) => {
      return subLink.type === "flat"
        ? subLink.path
        : Object.values(subLink.paths);
    });
  };

  const systemManagementPaths = getSubPaths("system-management");
  const drivingRangePaths = getSubPaths("driving-range");
  const golfPaths = getSubPaths("golf");
  const indoorSimulatorPaths = getSubPaths("indoor-simulator");

  if (
    systemManagementPaths.includes(path) &&
    systemManagementPaths.includes(nextPath)
  )
    return true;

  if (drivingRangePaths.includes(path) && drivingRangePaths.includes(nextPath))
    return true;

  if (golfPaths.includes(path) && golfPaths.includes(nextPath)) return true;

  if (
    indoorSimulatorPaths.includes(path) &&
    indoorSimulatorPaths.includes(path)
  )
    return true;

  return false;
};
