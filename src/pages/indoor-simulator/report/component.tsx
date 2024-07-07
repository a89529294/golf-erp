import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/layouts/main-layout";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { loader } from "./loader";
import { useQuery } from "@tanstack/react-query";
import { genIndoorSimulatorStoresWithSitesQuery } from "@/pages/indoor-simulator/site-management/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect } from "react";
import { ReportContainer } from "@/pages/indoor-simulator/report/components/report-container";

export function Component() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { storeId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...genIndoorSimulatorStoresWithSitesQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
    initialData: initialData.simulators,
  });

  const onStoreValueChange = useCallback(
    (storeId: string, replace: boolean) => {
      const range = encodeURIComponent("2024-01-01:2024-12-31");
      navigate(
        `/indoor-simulator/report/${storeId}?query=revenue&range=${range}`,
        { replace },
      );
    },
    [navigate],
  );

  useEffect(() => {
    if (storeId) return;
    if (stores[0]) onStoreValueChange(stores[0].id, true);
  }, [stores, onStoreValueChange, storeId]);

  return (
    <MainLayout
      headerChildren={
        <>
          <Select
            value={storeId}
            onValueChange={(v) => onStoreValueChange(v, false)}
          >
            <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark">
              <SelectValue placeholder="選擇廠商" />
            </SelectTrigger>
            <SelectContent className="w-[280px]">
              {stores.length === 0 ? (
                <SelectItem key={0} value="undef" disabled>
                  請先新增模擬器廠商
                </SelectItem>
              ) : (
                stores.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </>
      }
    >
      <div className="w-full border border-line-gray bg-light-gray p-5">
        <ReportContainer />
      </div>
    </MainLayout>
  );
}
