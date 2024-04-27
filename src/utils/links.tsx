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
  subLinks: { [key: string]: FlatLink | MultipleLink };
};
export type MultipleLink = {
  label: string;
  paths: { [key: string]: string };
  lazy: { [key: string]: () => Promise<unknown> };
  type: "multiple";
};

const SYSTEM_MANAGEMENT_BASE_PATH = "/system-management";
// const MEMBER_MANAGEMENT_BASE_PATH = "/member-management";

export const linksKV = {
  "indoor-simulator": {
    label: "室內模擬器",
    path: "/indoor-simulator",
    lazy: () => import("@/pages/indoor-simulator"),
    type: "flat" as const,
  },
  golf: {
    label: "高爾夫球",
    path: "/golf",
    lazy: () => import("@/pages/golf"),
    type: "flat" as const,
  },
  "driving-range": {
    label: "練習場",
    path: "/driving-range",
    lazy: () => import("@/pages/driving-range"),
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
        lazy: {
          index: () => import("@/pages/personnel-data-management"),
          new: () => import("@/pages/new-employee"),
        },
        // elements: { index: <PersonnelDataManagement />, new: <NewEmployee /> },
        // loaders: {
        //   index: personnelDataManagementLoader,
        //   new: newEmployeeLoader,
        // } as Record<string, LoaderFunction>,
        // errorElements: {
        //   index: <ErrorElement />,
        //   new: <ErrorElement />,
        // } as Record<string, ReactElement>,
        // actions: {
        //   new: newEmployeeAction,
        // } as Record<string, ActionFunction>,
        type: "multiple" as const,
      },
      "app-expenditure-level": {
        label: "APP消費級距",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-expenditure-level`,
        lazy: () => import("@/pages/app-expenditure-level"),
        type: "flat" as const,
      },
      "system-operation-management": {
        label: "系統操作管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/system-operation-management`,
        lazy: () => import("@/pages/system-operation-management"),
        type: "flat" as const,
      },
      "app-permission-management": {
        label: "功能權限管理",
        path: `${SYSTEM_MANAGEMENT_BASE_PATH}/app-permission-management`,
        lazy: () => import("@/pages/app-permission-management"),
        type: "flat" as const,
      },
    },
  },
  "client-management": {
    label: "廠商管理",
    path: "/client-management",
    lazy: () => import("@/pages/client-management"),
    type: "flat" as const,
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
