export type FlatLink = {
  label: string;
  path: string;
  lazy: () => Promise<unknown>;
  type: "flat";
};
export type NestedLink = {
  label: string;
  path: string;
  basePath: string;
  // element: ReactElement;
  type: "nested";
  subLinks: (FlatLink | MultipleLink)[];
};
export type MultipleLink = {
  label: string;
  paths: string[];
  lazy: (() => Promise<unknown>)[];
  type: "multiple";
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

export const linksKV = {
  "indoor-simulator": {
    label: "室內模擬器",
    type: "nested" as const,
    basePath: INDOOR_SIMULATOR_BASE_PATH,
    path: `${INDOOR_SIMULATOR_BASE_PATH}/basic-operations`,
    allowedPermissions: ["模擬器-基本操作", "模擬器-報表"],
    subLinks: {
      "basic-operations": {
        label: "基本操作",
        path: `${INDOOR_SIMULATOR_BASE_PATH}/basic-operations`,
        lazy: () => import("@/pages/indoor-simulator/basic-operations"),
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
        lazy: () => import("@/pages/app-expenditure-level"),
        type: "flat" as const,
        allowedPermissions: ["管理系統"],
      },
    },
  },
  // "client-management": {
  //   label: "廠商管理",
  //   path: "/client-management",
  //   lazy: () => import("@/pages/client-management"),
  //   type: "flat" as const,
  //   allowedPermissions: ["廠商管理"],
  // },
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

export const links = Object.values(linksKV).map((outerLink) => ({
  ...outerLink,
  subLinks: Object.values(outerLink.subLinks).map((innerLink) => {
    if (innerLink.type === "multiple")
      return {
        ...innerLink,
        paths: Object.values(innerLink.paths),
        lazy: Object.values(innerLink.lazy),
      };
    return innerLink;
  }),
}));

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

export function filterLinksByUserPermissions(userPermissions: string[]) {
  const allowedLinks = [];

  for (const outerLink of links) {
    if (
      userPermissions.find((up) => outerLink.allowedPermissions.includes(up))
    ) {
      const clonedOuterLink = { ...outerLink };
      allowedLinks.push(clonedOuterLink);

      clonedOuterLink.subLinks = clonedOuterLink.subLinks.filter((subLink) =>
        userPermissions.find((up) => subLink.allowedPermissions.includes(up)),
      );
    }
  }

  return allowedLinks;
}
