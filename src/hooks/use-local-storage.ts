import { useCallback, useState } from "react";
import { JSONValue } from "../utils/types";

export const useLocalStorage = <V extends JSONValue>(
  keyName: string,
  defaultValue: V,
) => {
  const [storedValue, setStoredValue] = useState<V | null>(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue: V) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue);
  };

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(keyName);
    } catch (err) {
      console.log(err);
    }
    setStoredValue(null);
  }, [keyName]);

  return [storedValue, setValue, clearValue] as const;
};
