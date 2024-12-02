import { User } from "@/hooks/use-auth";
import { ReportInterval, reportTimeRange } from "@/types-and-schemas/report";
import { SimpleStore } from "@/utils/types";
import imageCompression from "browser-image-compression";
import {
  endOfMonth,
  endOfYear,
  isSameDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { NavigateFunction, SetURLSearchParams } from "react-router-dom";
import { privateFetch } from "./utils";
import * as XLSX from "xlsx";

export const base_url = import.meta.env.VITE_BASE_URL;

export const localStorageUserKey = "golf-erp-user";

export const storeCategoryMap = {
  golf: "高爾夫",
  simulator: "室內模擬器",
  ground: "練習場",
};

export const storeCategoryWithAllMap = {
  all: "全部",
  ...storeCategoryMap,
};

// TODO figure out how to extract this tuple from above
export const storeCategories = ["golf", "simulator", "ground"] as const;
export type StoreCategoryTuple = typeof storeCategories;
export const storeCategoriesWithAll = ["all", ...storeCategories] as const;
export type StoreCategoryWithAllTuple = typeof storeCategoriesWithAll;

export type StoreCategory = keyof typeof storeCategoryMap;

export const toMinguoDate = (date: Date) =>
  date
    ? `${date.getFullYear() - 1911}-${date.getMonth() + 1}-${date.getDate()}`
    : "";

export const getDifferenceInHoursAndMinutes = (start: number, end: number) => {
  const differenceInMinutes = end - start;
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes % 60;
  return `${hours}小時${minutes}分鐘`;
};

export const fromImageIdsToSrc = async (
  ids: string[],
  alternativeURL?: string,
  placeholderImg = "",
) => {
  const promises: Promise<Response>[] = ids.map((id) =>
    privateFetch(`${alternativeURL || "/file/download/"}${id}`),
  );

  const responses = await Promise.allSettled(promises);

  const blobs = await Promise.all(
    responses.map((response) =>
      response.status === "fulfilled"
        ? response.value.blob()
        : Promise.resolve(new Blob()),
    ),
  );

  return blobs.map((blob) =>
    blob.size === 0 ? placeholderImg : URL.createObjectURL(blob),
  );
};

export function filterObject<T extends object>(obj: T, predicate: (keyof T)[]) {
  const result: { [K in keyof T]?: T[K] } = {};
  (Object.keys(obj) as Array<keyof T>).forEach((name) => {
    if (predicate.find((v) => name === v)) {
      result[name] = obj[name];
    }
  });
  return result;
}

/**
 * Parse a localized number to a float.
 * @param {string} stringNumber - the localized number
 * @param {string} locale - [optional] the locale that the number is represented in. Omit this parameter to use the current locale.
 */
export function parseLocaleNumber(stringNumber: string) {
  if (stringNumber === "") return 0;

  const thousandSeparator = Intl.NumberFormat()
    .format(11111)
    .replace(/\p{Number}/gu, "");
  const decimalSeparator = Intl.NumberFormat()
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), "."),
  );
}

export function toLocaleNumber(num: number) {
  return new Intl.NumberFormat().format(num);
}

export function fromDateToDateTimeString(d: Date) {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function fromDateToDateString(d: Date) {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export function fromDateAndTimeToDateTimeString(d: Date, time: string) {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}T${time.split(":")[0].padStart(2, "0")}:${time.split(":")[1].padStart(2, "0")}`;
}

export async function compressImage(file: File) {
  console.log("originalFile instanceof Blob", file instanceof Blob); // true
  console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      "compressedFile instanceof File",
      compressedFile instanceof File,
    ); // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

    return new File([compressedFile], file.name);
  } catch (error) {
    console.log(error);
    return file;
  }
}

export const numberToWeekDay = {
  0: "星期日",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
};

export const getAllowedStores = async (
  type: "ground" | "golf" | "simulator",
) => {
  // let allowedStores: StoreWithoutEmployees[] | "all";
  let allowedStores: SimpleStore[] | "all";
  const userFromLocalStorage = JSON.parse(
    localStorage.getItem(localStorageUserKey)!,
  ) as Exclude<User, null>;
  if (userFromLocalStorage.isAdmin) allowedStores = "all";
  else allowedStores = userFromLocalStorage.allowedStores[type];

  // const permissionsResponse = await privateFetch("/auth/permissions");
  // const permissions = await permissionsResponse.json();

  // if (permissions.includes("system:admin")) allowedStores = "all";
  // else {
  //   const authResponse = await privateFetch("/auth/me?populate=*");
  //   const user = (await authResponse.json()) as {
  //     employee: {
  //       stores: StoreWithoutEmployees[];
  //     };
  //   };

  //   allowedStores = user.employee.stores.filter((s) => s.category === type);
  // }

  return allowedStores;
};

export function formatDateAsString(d: Date) {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
}

export function updateSearchParams({
  setSearchParams,
  key,
  value,
}: {
  setSearchParams: SetURLSearchParams;
  key: string;
  value: string;
}) {
  setSearchParams((searchParams) => {
    const object = {} as Record<string, string>;
    searchParams.forEach((v, k) => {
      object[k] = v;
    });

    object[key] = value;

    return object;
  });
}

export function fromRangeStringToLastDateSetBy(
  rangeString: reportTimeRange,
): ReportInterval {
  const start = rangeString.split(":")[0];
  const end = rangeString.split(":")[1];
  if (
    isSameDay(startOfYear(new Date()), new Date(start)) &&
    isSameDay(endOfYear(new Date()), new Date(end))
  )
    return "year";

  if (
    isSameDay(startOfMonth(new Date()), new Date(start)) &&
    isSameDay(endOfMonth(new Date()), new Date(end))
  )
    return "month";

  if (
    isSameDay(new Date(), new Date(start)) &&
    isSameDay(new Date(), new Date(end))
  )
    return "day";

  return "range-picker";
}

export function roundUpToOneDecimalPlace(num: number) {
  return Math.round(num * 10) / 10;
}

export const toValueLabelArray = (obj: { name: string; id: string }[]) => {
  const options: Record<string, string> = {};
  obj.forEach((s) => (options[s.id] = s.name));
  return options;
};

export const navigateUponLogin = (
  permissions: string[],
  navigate: NavigateFunction,
) => {
  if (permissions.includes("系統管理")) {
    navigate("/member-management/members", { replace: true });
  } else if (permissions.includes("模擬器-基本操作")) {
    navigate("/indoor-simulator/member-management", { replace: true });
  } else if (permissions.includes("高爾夫球-基本操作")) {
    navigate("/golf/member-management", { replace: true });
  } else if (permissions.includes("練習場-基本操作")) {
    navigate("/driving-range/member-management", { replace: true });
  } else if (permissions.includes("會員身分折扣管理")) {
    navigate("/member-management/discount-management", { replace: true });
  } else if (permissions.includes("教練管理")) {
    navigate("/coach-management", { replace: true });
  } else if (permissions.includes("廠商管理")) {
    navigate("/store-management", { replace: true });
  } else if (permissions.includes("模擬器-報表")) {
    navigate("/indoor-simulator/report", { replace: true });
  } else if (permissions.includes("高爾夫球-報表")) {
    navigate("/golf/report", { replace: true });
  } else if (permissions.includes("練習場-報表")) {
    navigate("/driving-range/report", { replace: true });
  } else if (permissions.includes("模擬器-贈送點數")) {
    navigate("/indoor-simulator/coupon-management", { replace: true });
  } else if (permissions.includes("高爾夫球-贈送點數")) {
    navigate("/golf/coupon-management", { replace: true });
  } else if (permissions.includes("練習場-贈送點數")) {
    navigate("/driving-range/coupon-management", { replace: true });
  } else if (permissions.includes("模擬器-累積點數設定")) {
    navigate("/indoor-simulator/reward-settings", { replace: true });
  } else if (permissions.includes("高爾夫球-累積點數設定")) {
    navigate("/golf/reward-settings", { replace: true });
  } else if (permissions.includes("練習場-累積點數設定")) {
    navigate("/driving-range/reward-settings", { replace: true });
  } else if (permissions.includes("模擬器-儲值優惠設定")) {
    navigate("/indoor-simulator/cashback-settings", { replace: true });
  } else if (permissions.includes("高爾夫球-儲值優惠設定")) {
    navigate("/golf/cashback-settings", { replace: true });
  } else if (permissions.includes("練習場-儲值優惠設定")) {
    navigate("/driving-range/cashback-settings", { replace: true });
  } else {
    navigate("/", { replace: true });
  }
};

export function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  }) as Promise<string>;
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function formatDateString(s: string) {
  return s.replace(
    /(\d{4}-\d{2}-\d{2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/,
    (match, date, hour, minute, second) => {
      // Pad hour, minute, and second to 2 digits if necessary
      const paddedHour = hour.padStart(2, "0");
      const paddedMinute = minute.padStart(2, "0");
      const paddedSecond = second.padStart(2, "0");

      return `${date}T${paddedHour}:${paddedMinute}:${paddedSecond}`;
    },
  );
}

export function exportToExcel(
  data: Record<string, string | number>[],
  filename = "data.xlsx",
) {
  // Step 1: Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();

  // Calculate the maximum width for each column
  const columnWidths = (Object.keys(data[0]) as (keyof (typeof data)[0])[]).map(
    (key) => {
      const maxLength = Math.max(
        key.length * 2, // header length
        ...data.map((row) => {
          return row[key] ? row[key]?.toString().length ?? 0 : 0;
        }), // max length of each cell in the column
      );
      return { wch: maxLength + 2 }; // add padding for better readability
    },
  );

  worksheet["!cols"] = columnWidths; // Set column widths in the worksheet

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Step 3: Generate a binary Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Step 4: Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Step 5: Create a link and trigger the download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
