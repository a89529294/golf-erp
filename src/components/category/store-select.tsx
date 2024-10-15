import { useAuth } from "@/hooks/use-auth";
import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StoreSelect({
  initialData,
  category,
  navigateTo,
}: {
  initialData: { id: string; name: string }[];
  category: "ground" | "golf" | "simulator";
  navigateTo: string;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const { data: stores } = useQuery({
    ...getStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores[category],
      category,
      user?.account ?? "",
    ),
    initialData,
  });

  const onStoreValueChange = useCallback(
    (storeId: string, replace: boolean) => {
      navigate(`${navigateTo}?storeId=${storeId}`, {
        replace,
      });
    },
    [navigate, navigateTo],
  );

  useEffect(() => {
    if (storeId) return;

    if (stores[0]) {
      onStoreValueChange(stores[0].id, true);
    }
  }, [stores, onStoreValueChange, storeId]);

  return (
    <Select
      value={storeId ?? ""}
      onValueChange={(v) => onStoreValueChange(v, false)}
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
