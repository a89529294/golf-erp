import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { ReportContainer } from "@/pages/indoor-simulator/report/components/report-container";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import {
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  genDataQuery,
  genIndoorSimulatorStoresQuery,
  loader,
  Order,
} from "./loader";
import { IconButton } from "@/components/ui/button";
import { exportToExcel, formatDateWithoutSeconds } from "@/utils";

export function Component() {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { storeId } = useParams();

  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: stores } = useQuery({
    ...genIndoorSimulatorStoresQuery(
      user?.isAdmin ? "all" : user?.allowedStores.simulator ?? [],
    ),
    initialData: initialData.simulators,
  });

  const { data } = useQuery({
    ...genDataQuery(
      storeId!,
      new Date((range ?? ":").split(":")[0]),
      new Date((range ?? ":").split(":")[1]),
    ),
    initialData: initialData.data,
    enabled: false,
  });

  const onStoreValueChange = useCallback(
    (storeId: string, replace: boolean) => {
      const range = encodeURIComponent("2024-01-01:2024-12-31");
      navigate(`/indoor-simulator/report/${storeId}?range=${range}`, {
        replace,
      });
    },
    [navigate],
  );

  useEffect(() => {
    if (storeId) return;
    if (stores[0]) onStoreValueChange(stores[0].id, true);
  }, [stores, onStoreValueChange, storeId]);

  const ordersWithNulls = Object.values(data?.detailed ?? {}).flatMap((v) => {
    return v.orders.filter((order) => order.appChargeHistory);
  });

  const orders = ordersWithNulls.filter((v): v is Order => !!v);

  const b = orders.map((o) => ({
    時間: o.createdAt,
    名稱: o.userName,
    電話: o.userPhone,
    merchantId: o.merchantId,
    付款方式: o.paymentMethod,
    訂單金額: o.amount,
  }));

  const a = Object.values(data?.detailed ?? {}).reduce(
    (acc, v) => {
      console.log(v.orders[0]);

      v.orders.forEach((order) => {
        const newOrderData = {
          名字: order.userName,
          電話: order.userPhone,
          信箱: order.userEmail,
          建立時間: formatDateWithoutSeconds(order.createdAt),
          開始時間: formatDateWithoutSeconds(
            order.simulatorAppointment?.startTime ?? "",
          ),
          結束時間: formatDateWithoutSeconds(
            order.simulatorAppointment?.endTime ?? "",
          ),
          merchantId: order.merchantId,
          付款方式: order.paymentMethod || "點數",
          金額: order.amount,
        };

        if (
          order.simulatorAppointment?.storeSimulator.name &&
          acc[order.simulatorAppointment.storeSimulator.name]
        ) {
          acc = {
            ...acc,
            [order.simulatorAppointment.storeSimulator.name]: [
              ...acc[order.simulatorAppointment.storeSimulator.name],
              newOrderData,
            ],
          };
        } else if (order.simulatorAppointment?.storeSimulator.name) {
          acc = {
            ...acc,
            [order.simulatorAppointment.storeSimulator.name]: [newOrderData],
          };
        }
      });

      return acc;
    },
    {} as Record<string, Record<string, string | number>[]>,
  );

  return (
    <MainLayout
      headerChildren={
        <>
          <Select
            value={storeId}
            onValueChange={(v) => onStoreValueChange(v, false)}
          >
            <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark sm:w-40">
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
          <IconButton
            icon="save"
            onClick={() =>
              exportToExcel({
                ...a,
                儲值紀錄: b,
              })
            }
          >
            匯出訂單細節
          </IconButton>
        </>
      }
    >
      {isMobile ? (
        ({ height }) => (
          <ScrollArea style={{ height }}>
            <div className="w-full border border-line-gray bg-light-gray p-5">
              {data && <ReportContainer data={data} stores={stores} />}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        )
      ) : (
        <div className="w-full overflow-auto border border-line-gray bg-light-gray p-5">
          {data && <ReportContainer data={data} stores={stores} />}
        </div>
      )}
    </MainLayout>
  );
}
