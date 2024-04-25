export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export const storeCategories = ["golf", "ground", "simulator"] as const;
export type StoreCategory = (typeof storeCategories)[number];
