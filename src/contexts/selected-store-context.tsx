import { selectedStoreContext } from "@/contexts/use-store-context";
import { ReactNode, useState } from "react";

export function SelectedStoreProvider({ children }: { children: ReactNode }) {
  const [simulatorStoreId, setSimulatorStoreId] = useState("");
  const [groundStoreId, setGroundStoreId] = useState("");

  return (
    <selectedStoreContext.Provider
      value={{
        simulatorStoreId,
        setSimulatorStoreId,
        groundStoreId,
        setGroundStoreId,
      }}
    >
      {children}
    </selectedStoreContext.Provider>
  );
}
