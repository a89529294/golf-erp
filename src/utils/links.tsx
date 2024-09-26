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
  allowedStoreCategory?: string;
};
export type MultipleLink = {
  label: string;
  paths: Record<string, string | { symbolicPath: string; path: string }>;
  lazy: Record<string, LazyRouteFunction<NonIndexRouteObject>>;
  type: "multiple";
  allowedPermissions: string[];
};

const INDOOR_SIMULATOR_BASE_PATH = "/indoor-simulator";
const GOLF_BASE_PATH = "/golf";
const DRIVING_RANGE_BASE_PATH = "/driving-range";
const SYSTEM_MANAGEMENT_BASE_PATH = "/system-management";
const MEMBERS_BASE_PATH = "/member-management";

// if you add/remove new nested links you must also modify
// src/index.tsx and sidebar.tsx
export const linksKV = {
  "driving-range": {
    label: "練習場",
    type: "nested" as const,
    basePath: DRIVING_RANGE_BASE_PATH,
    path: `${DRIVING_RANGE_BASE_PATH}/member-management`,
    allowedPermissions: ["練習場-基本操作", "練習場-報表", "練習場-贈送點數"],
    allowedStoreCategory: "ground" as const,
    subLinks: {
      "member-management": {
        label: "會員管理",
        type: "multiple" as const,
        paths: {
          index: `${DRIVING_RANGE_BASE_PATH}/member-management`,
          details: `${DRIVING_RANGE_BASE_PATH}/member-management/details/:id`,
        },
        lazy: {
          index: () => import("@/pages/driving-range/member-management"),
          details: () => import("@/pages/member-management/members/details"),
        },
        allowedPermissions: ["練習場-基本操作"],
      },
      "site-management": {
        label: "場地管理",
        paths: {
          index: {
            symbolicPath: `${DRIVING_RANGE_BASE_PATH}/site-management/:storeId?`,
            path: `${DRIVING_RANGE_BASE_PATH}/site-management`,
          },
          new: `${DRIVING_RANGE_BASE_PATH}/site-management/new`,
          details: `${DRIVING_RANGE_BASE_PATH}/site-management/:storeId/:siteId`,
        },
        lazy: {
          index: () => import("@/pages/driving-range/site-management"),
          new: () => import("@/pages/driving-range/site-management/new"),
          details: () =>
            import("@/pages/driving-range/site-management/details"),
        },
        type: "multiple" as const,
        allowedPermissions: ["練習場-基本操作"],
      },
      "appointment-management": {
        label: "預約管理",
        path: `${DRIVING_RANGE_BASE_PATH}/appointment-management`,
        lazy: () => import("@/pages/driving-range/appointment-management"),
        type: "flat" as const,
        allowedPermissions: ["練習場-基本操作"],
      },
      "cashback-settings": {
        label: "儲值優惠設定",
        path: `${DRIVING_RANGE_BASE_PATH}/cashback-settings`,
        lazy: () => import("@/pages/driving-range/cashback-settings"),
        type: "flat" as const,
        allowedPermissions: ["練習場-儲值優惠設定"],
      },
      "coupon-management": {
        label: "優惠券管理",
        path: `${DRIVING_RANGE_BASE_PATH}/coupon-management`,
        lazy: () => import("@/pages/driving-range/coupon-management"),
        type: "flat" as const,
        allowedPermissions: ["練習場-贈送點數"],
      },
      "reward-settings": {
        label: "累積點數設定",
        path: `${DRIVING_RANGE_BASE_PATH}/reward-settings`,
        lazy: () => import("@/pages/driving-range/reward-settings"),
        type: "flat" as const,
        allowedPermissions: ["練習場-累積點數設定"],
      },
      "repair-report": {
        label: "報修回報",
        path: `${DRIVING_RANGE_BASE_PATH}/repair-report`,
        lazy: () => import("@/pages/driving-range/repair-report"),
        type: "flat" as const,
        allowedPermissions: ["練習場-基本操作"],
      },
      report: {
        label: "報表",
        // path: `${INDOOR_SIMULATOR_BASE_PATH}/report/:storeId`,
        paths: {
          index: {
            symbolicPath: `${DRIVING_RANGE_BASE_PATH}/report/:storeId?`,
            path: `${DRIVING_RANGE_BASE_PATH}/report`,
          },
        },
        lazy: {
          index: () => import("@/pages/driving-range/report"),
        },
        type: "multiple" as const,
        allowedPermissions: ["練習場-報表"],
      },
    },
  },
  golf: {
    label: "高爾夫球",
    type: "nested" as const,
    basePath: GOLF_BASE_PATH,
    path: `${GOLF_BASE_PATH}/site-management`,
    allowedPermissions: [
      "高爾夫球-基本操作",
      "高爾夫球-報表",
      "高爾夫球-贈送點數",
    ],
    allowedStoreCategory: "golf" as const,
    subLinks: {
      "site-management": {
        label: "場地管理",
        paths: {
          index: {
            symbolicPath: `${GOLF_BASE_PATH}/site-management/:storeId?`,
            path: `${GOLF_BASE_PATH}/site-management`,
          },
          new: `${GOLF_BASE_PATH}/site-management/new`,
          details: `${GOLF_BASE_PATH}/site-management/:storeId/:siteId`,
        },
        lazy: {
          index: () => import("@/pages/golf/site-management"),
          new: () => import("@/pages/golf/site-management/new"),
          details: () => import("@/pages/golf/site-management/details"),
        },
        type: "multiple" as const,
        allowedPermissions: ["高爾夫球-基本操作"],
      },
      // "member-management": {
      //   label: "會員管理",
      //   type: "multiple" as const,
      //   paths: {
      //     index: `${GOLF_BASE_PATH}/member-management`,
      //     details: `${GOLF_BASE_PATH}/member-management/details/:id`,
      //   },
      //   lazy: {
      //     index: () => import("@/pages/golf/member-management"),
      //     details: () => import("@/pages/member-management/details"),
      //   },
      //   allowedPermissions: ["高爾夫球-基本操作"],
      // },
      "invitation-management": {
        label: "邀約管理",
        paths: {
          index: `${GOLF_BASE_PATH}/invitation-management`,
          new: `${GOLF_BASE_PATH}/invitation-management/new`,
          details: `${GOLF_BASE_PATH}/invitation-management/:invitationId`,
        },
        lazy: {
          index: () => import("@/pages/golf/invitation-management"),
          new: () => import("@/pages/golf/invitation-management/new"),
          details: () => import("@/pages/golf/invitation-management/details"),
        },
        type: "multiple" as const,
        allowedPermissions: ["高爾夫球-基本操作"],
      },
      "cashback-settings": {
        label: "儲值優惠設定",
        path: `${GOLF_BASE_PATH}/cashback-settings`,
        lazy: () => import("@/pages/golf/cashback-settings"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-儲值優惠設定"],
      },
      "coupon-management": {
        label: "優惠券管理",
        path: `${GOLF_BASE_PATH}/coupon-management`,
        lazy: () => import("@/pages/golf/coupon-management"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-贈送點數"],
      },
      "reward-settings": {
        label: "累積點數設定",
        path: `${GOLF_BASE_PATH}/reward-settings`,
        lazy: () => import("@/pages/golf/reward-settings"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-累積點數設定"],
      },
      "repair-report": {
        label: "報修回報",
        path: `${GOLF_BASE_PATH}/repair-report`,
        lazy: () => import("@/pages/golf/repair-report"),
        type: "flat" as const,
        allowedPermissions: ["高爾夫球-基本操作"],
      },
      // report: {
      //   label: "報表",
      //   path: `${GOLF_BASE_PATH}/report`,
      //   lazy: () => import("@/pages/golf/report"),
      //   type: "flat" as const,
      //   allowedPermissions: ["高爾夫球-報表"],
      // },
    },
  },
  "indoor-simulator": {
    label: "室內模擬器",
    type: "nested" as const,
    basePath: INDOOR_SIMULATOR_BASE_PATH,
    path: `${INDOOR_SIMULATOR_BASE_PATH}/member-management`,
    allowedPermissions: ["模擬器-基本操作", "模擬器-報表", "模擬器-贈送點數"],
    allowedStoreCategory: "simulator" as const,
    subLinks: {
      "member-management": {
        label: "會員管理",
        type: "multiple" as const,
        paths: {
          index: `${INDOOR_SIMULATOR_BASE_PATH}/member-management`,
          // new: `${INDOOR_SIMULATOR_BASE_PATH}/member-management/new`,
          details: `${INDOOR_SIMULATOR_BASE_PATH}/member-management/details/:id`,
        },
        lazy: {
          index: () => import("@/pages/indoor-simulator/member-management"),
          // new: () => import("@/pages/member-management/new"),
          details: () => import("@/pages/member-management/members/details"),
        },
        allowedPermissions: ["模擬器-基本操作"],
      },
      "site-management": {
        label: "場地管理",
        paths: {
          index: {
            symbolicPath: `${INDOOR_SIMULATOR_BASE_PATH}/site-management/:storeId?`,
            path: `${INDOOR_SIMULATOR_BASE_PATH}/site-management`,
          },
          new: `${INDOOR_SIMULATOR_BASE_PATH}/site-management/new`,
          details: `${INDOOR_SIMULATOR_BASE_PATH}/site-management/:storeId/:siteId`,
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
      "cashback-settings": {
        label: "儲值優惠設定",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/cashback-settings`,
        lazy: () => import("@/pages/indoor-simulator/cashback-settings"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-儲值優惠設定"],
      },
      "coupon-management": {
        label: "優惠券管理",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/coupon-management`,
        lazy: () => import("@/pages/indoor-simulator/coupon-management"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-贈送點數"],
      },
      "reward-settings": {
        label: "累積點數設定",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/reward-settings`,
        lazy: () => import("@/pages/indoor-simulator/reward-settings"),
        type: "flat" as const,
        allowedPermissions: ["模擬器-累積點數設定"],
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
        // path: `${INDOOR_SIMULATOR_BASE_PATH}/report/:storeId`,
        paths: {
          index: {
            symbolicPath: `${INDOOR_SIMULATOR_BASE_PATH}/report/:storeId?`,
            path: `${INDOOR_SIMULATOR_BASE_PATH}/report`,
          },
        },
        lazy: {
          index: () => import("@/pages/indoor-simulator/report"),
        },
        type: "multiple" as const,
        allowedPermissions: ["模擬器-報表"],
      },
    },
  },
  "system-management": {
    label: "系統管理",
    type: "nested" as const,
    basePath: SYSTEM_MANAGEMENT_BASE_PATH,
    path: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management`,
    allowedPermissions: ["系統管理"],
    subLinks: {
      "personnel-system-management": {
        label: "人員資料管理",
        paths: {
          index: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management`,
          new: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management/new`,
          details: `${SYSTEM_MANAGEMENT_BASE_PATH}/personnel-management/details/:id`,
        },
        lazy: {
          index: () => import("@/pages/system-management/personnel-management"),
          new: () =>
            import("@/pages/system-management/personnel-management/new"),
          details: () =>
            import("@/pages/system-management/personnel-management/details"),
        },
        type: "multiple" as const,
        allowedPermissions: ["系統管理"],
      },
      "system-operation-management": {
        label: "系統操作管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/system-operation-management`,
        lazy: () =>
          import("@/pages/system-management/system-operation-management"),
        type: "flat" as const,
        allowedPermissions: ["系統管理"],
      },
      "app-permission-management": {
        label: "功能權限管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-permission-management`,
        lazy: () =>
          import("@/pages/system-management/app-permission-management"),
        type: "flat" as const,
        allowedPermissions: ["系統管理"],
      },
      "app-expenditure-level": {
        label: "APP消費級距",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-expenditure-level`,
        lazy: () => import("@/pages/system-management/app-expenditure-level"),
        type: "flat" as const,
        allowedPermissions: ["系統管理"],
      },
      "banner-carousel": {
        label: "Banner 設定",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/banner-carousel`,
        lazy: () => import("@/pages/system-management/banner-carousel"),
        type: "flat" as const,
        allowedPermissions: ["系統管理"],
      },
    },
  },
  "store-management": {
    label: "廠商管理",
    type: "multiple" as const,
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
    allowedPermissions: ["廠商管理"],
  },
  "equipment-management": {
    label: "標籤管理",
    type: "multiple" as const,
    paths: {
      index: "/equipment-management",
    },
    lazy: {
      index: () => import("@/pages/equipment-management"),
    },
    allowedPermissions: ["廠商管理"],
  },
  "member-management": {
    label: "會員管理",
    type: "nested" as const,
    basePath: MEMBERS_BASE_PATH,
    path: `${MEMBERS_BASE_PATH}/members`,
    subLinks: {
      members: {
        label: "會員管理",
        type: "multiple" as const,
        paths: {
          index: `${MEMBERS_BASE_PATH}/members`,
          new: `${MEMBERS_BASE_PATH}/members/new`,
          details: `${MEMBERS_BASE_PATH}/members/details/:id`,
        },
        lazy: {
          index: () => import("@/pages/member-management/members"),
          new: () => import("@/pages/member-management/members/new"),
          details: () => import("@/pages/member-management/members/details"),
        },
        allowedPermissions: ["系統管理"],
      },
      "discount-management": {
        label: "會員身分折扣管理",
        type: "flat" as const,
        path: `${MEMBERS_BASE_PATH}/discount-management`,
        lazy: () => import("@/pages/member-management/discount-management"),
        allowedPermissions: ["會員身分折扣管理"],
      },
    },
    allowedPermissions: [
      "模擬器-基本操作",
      "高爾夫球-基本操作",
      "練習場-基本操作",
    ],
  },
  "coach-management": {
    label: "教練管理",
    type: "multiple" as const,
    paths: {
      index: "/coach-management",
      details: "/coach-management/details/:coachId",
    },
    lazy: {
      index: () => import("@/pages/coach-management"),
      details: () => import("@/pages/coach-management/details"),
    },
    allowedPermissions: ["教練管理"], // TODO: add permission
  },
};
// } satisfies Record<string, FlatLink | NestedLink>;

const links = Object.values(linksKV);

export const isBelowLink = (prevPath: string, nextPath: string) => {
  const getPath = (link: NestedLink | MultipleLink) =>
    link.type === "nested"
      ? link.path
      : typeof link.paths.index === "object"
        ? link.paths.index.path
        : link.paths.index;

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

    const x = obj.subLinks;

    return Object.values(x).flatMap((subLink) => {
      return subLink.type === "flat"
        ? subLink.path
        : Object.values(subLink.paths).map((v) => {
            return typeof v === "object" && v && "path" in v ? v?.path : v;
          });
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
