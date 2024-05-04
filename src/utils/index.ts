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
