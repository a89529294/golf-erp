import { useAuth } from "@/hooks/use-auth";
import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedStoreContext } from "@/contexts/use-store-context";

export function StoreSelect({
  initialData,
  category,
  navigateTo,
  setStoreName,
}: {
  initialData: { id: string; name: string }[];
  category: "ground" | "golf" | "simulator";
  navigateTo: string;
  setStoreName?: (s: string) => void;
}) {
  const {
    simulatorStoreId,
    setSimulatorStoreId,
    groundStoreId,
    setGroundStoreId,
  } = useSelectedStoreContext();

  const { user } = useAuth();
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const { data: stores } = useQuery({
    ...getStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores[category],
      category,
      user?.account ?? "",
    ),
    initialData,
    staleTime: 5000,
  });

  const updateStoreName = useCallback(
    (sid: string) => {
      setStoreName &&
        setStoreName(stores.find((s) => s.id === sid)?.name ?? "");
    },
    [setStoreName, stores],
  );

  const onStoreValueChange = useCallback(
    (category: string, storeId: string, replace: boolean) => {
      // navigate(`${navigateTo}?storeId=${storeId}`, {
      //   replace,
      // });

      // storeId context update
      if (category === "simulator") setSimulatorStoreId(storeId);
      if (category === "ground") setGroundStoreId(storeId);

      // storeId search params update
      const params = new URLSearchParams();
      params.set("storeId", storeId);
      setSearchParams(params, { replace });

      // store name update
      updateStoreName(storeId);
    },
    [setSearchParams, setSimulatorStoreId, setGroundStoreId, updateStoreName],
  );

  useEffect(() => {
    if (category === "simulator" && simulatorStoreId) {
      onStoreValueChange(category, simulatorStoreId, true);

      return;
    }

    if (category === "ground" && groundStoreId) {
      onStoreValueChange(category, groundStoreId, true);
      return;
    }

    if (storeId) {
      onStoreValueChange(category, storeId, true);
      return;
    }

    if (stores[0]) {
      onStoreValueChange(category, stores[0].id, true);
    }
  }, [
    stores,
    onStoreValueChange,
    storeId,
    setStoreName,
    setSearchParams,
    category,
    simulatorStoreId,
    groundStoreId,
  ]);

  return (
    <Select
      value={storeId ?? ""}
      onValueChange={(v) => onStoreValueChange(category, v, false)}
    >
      <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark sm:w-40">
        <SelectValue placeholder="選擇廠商" />
      </SelectTrigger>
      <SelectContent className="w-[280px]">
        {stores.length === 0 ? (
          <SelectItem key={0} value="undef" disabled>
            請先新增
            {category === "golf"
              ? "高爾夫廠商"
              : category === "ground"
                ? "練習場廠商"
                : "模擬器廠商"}
          </SelectItem>
        ) : (
          stores.map((g) => {
            return (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
}
