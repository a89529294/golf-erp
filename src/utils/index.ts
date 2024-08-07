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
import { SetURLSearchParams } from "react-router-dom";
import { privateFetch } from "./utils";

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

export const fromImageIdsToSrc = async (ids: string[]) => {
  const promises: Promise<Response>[] = [];

  ids.forEach((id) => promises.push(privateFetch(`/file/download/${id}`)));

  const preImages = await Promise.all(promises);

  const promises2: Promise<Blob>[] = [];
  preImages.forEach((response) => promises2.push(response.blob()));

  const images = await Promise.all(promises2);

  return images.map((blob) => URL.createObjectURL(blob));
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
