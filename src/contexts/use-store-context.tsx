import { createContext, useContext } from "react";

export const selectedStoreContext = createContext({
  simulatorStoreId: "",
  setSimulatorStoreId: (s: string) => {},
  groundStoreId: "",
  setGroundStoreId: (s: string) => {},
});

export const useSelectedStoreContext = () => useContext(selectedStoreContext);
