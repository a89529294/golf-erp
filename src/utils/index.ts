import { privateFetch } from "./utils";

export const base_url =
  "https://shinjhu-golf-reservation-system-be.caprover.credot-web.com";

export const localStorageUserKey = "user";

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
