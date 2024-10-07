import { Order, ReportData } from "@/pages/indoor-simulator/report/loader";
import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CircularProgressWithDesc } from "@/pages/indoor-simulator/report/components/circular-progress-with-desc";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { reportTimeRange } from "@/types-and-schemas/report";
import { roundUpToOneDecimalPlace } from "@/utils";
import {
  endOfMonth,
  endOfYear,
  isSameDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { columns } from "./top-up-section-columns";

export function TopUpSectionWrapper({ data }: { data: ReportData }) {
  const ordersWithNulls = Object.values(data.total.orders).map((v) => {
    if (!v.appChargeHistory) return null;

    return v;
  });

  const orders = ordersWithNulls.filter((v): v is Order => !!v);

  return orders.map((order) => {
    return (
      <TopUpSection
        key={order.id}
        id={order.id}
        orders={orders}
        data={data}
        merchantId={order.merchantId}
      />
    );
  });
}

export function TopUpSection({
  id,
  orders,
  data,
  merchantId,
}: {
  id: string;
  orders: Order[];
  data: ReportData;
  merchantId?: string;
}) {
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range")! as reportTimeRange;
  const startAt = range.split(":")[0];
  const endAt = range.split(":")[1];
  const [open, setOpen] = React.useState(false);

  const isCurrentYearSelected =
    isSameDay(startOfYear(new Date()), new Date(startAt)) &&
    isSameDay(endOfYear(new Date()), new Date(endAt));
  const isCurrentMonthSelected =
    isSameDay(startOfMonth(new Date()), new Date(startAt)) &&
    isSameDay(endOfMonth(new Date()), new Date(endAt));
  const isCurrentDaySelected =
    isSameDay(new Date(), new Date(startAt)) &&
    isSameDay(new Date(), new Date(endAt));

  const currentYearRevenue = Object.values(data.year).reduce((acc, v) => {
    return acc + v.orders.reduce((acc, v) => v.amount + acc, 0);
  }, 0);

  const secondCircularBarLabel = (() => {
    if (isCurrentYearSelected) return `${new Date().getFullYear()}營業額`;
    if (isCurrentMonthSelected) return `${new Date().getMonth() + 1}月營業額`;
    if (isCurrentDaySelected) return `${new Date().getDate()}日營業額`;
    return "指定範圍 營業額";
  })();

  const secondCircularBarPercentage = (() => {
    if (isCurrentYearSelected) {
      if (currentYearRevenue === 0) return 0;
      if (data.total.totalCount === 0) return 0;
      return roundUpToOneDecimalPlace(
        (currentYearRevenue / data.total.totalAmount) * 100,
      );
    }
    const currentPeriodRevenue = Object.values(data.detailed).reduce(
      (acc, v) => {
        return acc + v.orders.reduce((acc, v) => v.amount + acc, 0);
      },
      0,
    );
    const currentPeriodRevenueForAllSites = Object.values(data.detailed).reduce(
      (acc, v) => acc + v.totalAmount,
      0,
    );

    if (currentPeriodRevenue === 0) return 0;
    if (currentPeriodRevenueForAllSites === 0) return 0;

    return roundUpToOneDecimalPlace(
      (currentPeriodRevenue / currentPeriodRevenueForAllSites) * 100,
    );
  })();

  const secondCircularBarAmount =
    ((isCurrentYearSelected
      ? Object.values(data.year).reduce((acc, v) => {
          return (
            acc +
            v.orders.reduce((acc, val) => {
              if (!val.appChargeHistory) return acc;
              return acc + val.amount;
            }, 0)
          );
        }, 0)
      : Object.values(data.detailed).reduce((acc, v) => {
          return (
            acc +
            v.orders.reduce((acc, val) => {
              if (!val.appChargeHistory) return acc;
              return acc + val.amount;
            }, 0)
          );
        }, 0)) *
      secondCircularBarPercentage) /
    100;

  const currentPeriodSiteAppointmentCount = (() => {
    if (isCurrentYearSelected)
      return Object.values(data.year).reduce((acc, v) => {
        return (
          acc +
          v.orders.reduce((acc, val) => {
            if (!val.appChargeHistory) return acc;
            return acc + 1;
          }, 0)
        );
      }, 0);

    return Object.values(data.detailed).reduce((acc, v) => {
      return (
        acc +
        v.orders.reduce((acc, val) => {
          if (!val.appChargeHistory) return acc;
          return acc + 1;
        }, 0)
      );
    }, 0);
  })();

  const currentPeriodSiteAppointmentPercentage = (() => {
    const currentPeriodSiteAppointmentCount = Object.values(
      data.detailed,
    ).reduce((acc, v) => {
      return acc + v.orders.length;
    }, 0);
    const currenPeriodSiteAppointCountForAllSites = Object.values(
      data.detailed,
    ).reduce((acc, v) => acc + v.totalCount, 0);

    if (
      currentPeriodSiteAppointmentCount === 0 ||
      currenPeriodSiteAppointCountForAllSites === 0
    )
      return 0;

    return roundUpToOneDecimalPlace(
      (currentPeriodSiteAppointmentCount /
        currenPeriodSiteAppointCountForAllSites) *
        100,
    );
  })();

  const lastCircularBarLabel = (() => {
    if (isCurrentYearSelected) return `${new Date().getFullYear()}訂單數`;
    if (isCurrentMonthSelected) return `${new Date().getMonth() + 1}月訂單數`;
    if (isCurrentDaySelected) return `${new Date().getDate()}日訂單數`;

    return `指定範圍訂單數`;
  })();

  const tableData = useMemo(() => {
    return orders.map((v) => ({
      id: v.id,
      name: v.userName,
      phone: v.userPhone,
      createdAt: v.createdAt ?? "",
      amount: v.amount,
      merchantId,
      paymentType: v.paymentMethod,
    }));
  }, [merchantId, orders]);

  return (
    <section className="col-span-2 rounded-md bg-white px-5 py-4">
      <h2 className="text-lg font-bold">儲值紀錄</h2>
      <ul className="mb-4 mt-2.5 flex gap-4">
        <CircularProgressWithDesc
          filledPercentage={secondCircularBarPercentage}
          amount={secondCircularBarAmount}
          label={secondCircularBarLabel}
        />
        <CircularProgressWithDesc
          filledPercentage={currentPeriodSiteAppointmentPercentage}
          amount={currentPeriodSiteAppointmentCount}
          label={lastCircularBarLabel}
          type="secondary"
        />

        <TextButton className="ml-auto self-end" onClick={() => setOpen(!open)}>
          展開訂單
        </TextButton>
      </ul>

      <ScrollArea className={open ? "max-h-[390px]" : "max-h-0"}>
        <GenericDataTable columns={columns} data={tableData} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
