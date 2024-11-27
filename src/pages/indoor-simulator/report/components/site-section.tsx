import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircularProgressWithDesc } from "@/pages/indoor-simulator/report/components/circular-progress-with-desc";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { Order, ReportData } from "@/pages/indoor-simulator/report/loader";
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
import { columns } from "./site-section-columns";

export function SiteSection({
  id,
  title,
  appointments,
  data,
  merchantId,
}: {
  id: string;
  title: string;
  appointments: Order[];
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
    return (
      acc +
      v.orders
        .filter((order) => order.simulatorAppointment?.storeSimulator.id === id)
        .reduce((acc, v) => v.amount + acc, 0)
    );
  }, 0);

  // const totalSiteRevenuePercentage = (() => {
  //   if (currentYearRevenue === 0) return 0;
  //   if (data.total.totalAmount === 0) return 0;
  //   return roundUpToOneDecimalPlace(
  //     (data.total.storeSimulatorAppointments[id].totalAmount /
  //       data.total.totalAmount) *
  //       100,
  //   );
  // })();

  const secondCircularBarLabel = (() => {
    if (isCurrentYearSelected) return `${new Date().getFullYear()}營業額`;
    if (isCurrentMonthSelected) return `${new Date().getMonth() + 1}月營業額`;
    if (isCurrentDaySelected) return `${new Date().getDate()}日營業額`;
    return "指定範圍 營業額";
  })();

  const currentPeriodRevenue = Object.values(data.detailed).reduce((acc, v) => {
    return (
      acc +
      v.orders
        .filter((order) => order.simulatorAppointment?.storeSimulator.id === id)
        .reduce((acc, v) => {
          console.log(v.amount);
          return v.amount + acc;
        }, 0)
    );
  }, 0);

  const secondCircularBarPercentage = (() => {
    if (isCurrentYearSelected) {
      if (currentYearRevenue === 0) return 0;
      if (data.total.totalCount === 0) return 0;
      return roundUpToOneDecimalPlace(
        (currentYearRevenue / data.total.totalAmount) * 100,
      );
    }

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

  const secondCircularBarAmount = isCurrentYearSelected
    ? currentYearRevenue
    : currentPeriodRevenue;

  // const totalAppointmentCount = data.total.totalCount;

  // const totalAppointmentCountForAllSites = data.total.totalCount;

  // const thirdCircularBarPercentage = (() => {
  //   if (totalAppointmentCount === 0) return 0;

  //   if (totalAppointmentCountForAllSites === 0) return 0;

  //   return roundUpToOneDecimalPlace(
  //     (data.total.storeSimulatorAppointments[id].totalCount /
  //       totalAppointmentCountForAllSites) *
  //       100,
  //   );
  // })();

  const currentPeriodSiteAppointmentCount = (() => {
    if (isCurrentYearSelected)
      return Object.values(data.year).reduce((acc, v) => {
        return (
          acc +
          v.orders.filter(
            (order) => order.simulatorAppointment?.storeSimulator.id === id,
          ).length
        );
      }, 0);

    return Object.values(data.detailed).reduce((acc, v) => {
      return (
        acc +
        v.orders.filter(
          (order) => order.simulatorAppointment?.storeSimulator.id === id,
        ).length
      );
    }, 0);
  })();

  const currentPeriodSiteAppointmentPercentage = (() => {
    const currentPeriodSiteAppointmentCount = Object.values(
      data.detailed,
    ).reduce((acc, v) => {
      return (
        acc +
        v.orders.filter(
          (order) => order.simulatorAppointment?.storeSimulator.id === id,
        ).length
      );
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
    return appointments.map((v) => {
      let sd: Date | "" = "";
      let ed: Date | "" = "";
      let sdFormatted = "";
      let edFormatted = "";
      if (v.simulatorAppointment?.startTime) {
        sd = new Date(v.simulatorAppointment.startTime);
        sd.setHours(sd.getHours() - 8);
        sdFormatted = new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
          .format(sd)
          .replace(",", "");
      }
      if (v.simulatorAppointment?.endTime) {
        ed = new Date(v.simulatorAppointment.endTime);
        ed.setHours(ed.getHours() - 8);

        edFormatted = new Intl.DateTimeFormat("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
          .format(ed)
          .replace(",", "");
      }

      return {
        id: v.id,
        name: v.simulatorAppointment?.appUser?.chName,
        phone: v.simulatorAppointment?.appUser?.phone,
        startDateTime: sdFormatted,
        endDateTime: edFormatted,
        amount: v.amount,
        merchantId,
        paymentType: v.paymentMethod,
      };
    });
  }, [merchantId, appointments]);

  return (
    <section className="col-span-2 rounded-md bg-white px-5 py-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mb-4 mt-2.5 flex gap-4">
        {/* <CircularProgressWithDesc
          filledPercentage={totalSiteRevenuePercentage}
          amount={data.total.totalAmount}
          label="總營業額"
        /> */}
        <CircularProgressWithDesc
          filledPercentage={secondCircularBarPercentage}
          amount={secondCircularBarAmount}
          label={secondCircularBarLabel}
        />
        {/* <CircularProgressWithDesc
          filledPercentage={thirdCircularBarPercentage}
          amount={data.total.totalCount}
          label="總訂單數"
          type="secondary"
        /> */}
        <CircularProgressWithDesc
          filledPercentage={currentPeriodSiteAppointmentPercentage}
          amount={currentPeriodSiteAppointmentCount}
          label={lastCircularBarLabel}
          type="secondary"
        />

        <TextButton className="ml-auto self-end" onClick={() => setOpen(!open)}>
          {!open ? "展開訂單" : "關閉訂單"}
        </TextButton>
      </ul>

      <ScrollArea className={open ? "max-h-[390px]" : "max-h-0"}>
        <GenericDataTable columns={columns} data={tableData} />
      </ScrollArea>
    </section>
  );
}
