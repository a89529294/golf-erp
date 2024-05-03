export const base_url =
  "https://shinjhu-golf-reservation-system-be.caprover.credot-web.com";

export const localStorageUserKey = "user";

export const storeCategoryMap = {
  golf: "高爾夫",
  simulator: "室內模擬器",
  ground: "練習場",
};

// TODO figure out how to extract this tuple from above
export type StoreCategoryTuple = ["golf", "simulator", "ground"];

export type StoreCategory = keyof typeof storeCategoryMap;

export const storeCategoryArray = [
  Object.keys(storeCategoryMap)[0],
  Object.keys(storeCategoryMap)[1],
  Object.keys(storeCategoryMap)[2],
] as const;
