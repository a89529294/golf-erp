export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export type ValueOf<T> = T[keyof T];

export type SimpleStore = {
  id: string;
  name: string;
  county: string;
  district: string;
  address: string;
};
