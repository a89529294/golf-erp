import { GenericDataTable } from "@/components/generic-data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CircularProgressWithDesc } from "@/pages/indoor-simulator/report/components/circular-progress-with-desc";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import { ReportData } from "@/pages/indoor-simulator/report/loader";
import { Appointment } from "@/types-and-schemas/appointment";
import { reportTimeRange } from "@/types-and-schemas/report";
import { roundUpToOneDecimalPlace } from "@/utils";
import {
  endOfMonth,
  endOfYear,
  isSameDay,
  startOfMonth,
  startOfYear,
} from "date-fns";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { columns } from "./site-section-columns";

export function SiteSection({
  id,
  title,
  appointments,
  data,
}: {
  id: string;
  title: string;
  appointments: Appointment[];
  data: ReportData;
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

  const currentYearRevenue = Object.values(data.year).reduce(
    (acc, v) =>
      acc +
      v.storeSimulatorAppointments[id].reduce((acc, v) => acc + v.amount, 0),
    0,
  );

  const totalSiteRevenuePercentage = (() => {
    if (currentYearRevenue === 0) return 0;
    if (data.total.totalAmount === 0) return 0;
    return roundUpToOneDecimalPlace(
      (data.total.storeSimulatorAppointments[id].totalAmount /
        data.total.totalAmount) *
        100,
    );
  })();

  const secondCircularBarLabel = (() => {
    if (isCurrentYearSelected) return `${new Date().getFullYear()}營業額`;
    if (isCurrentMonthSelected) return `${new Date().getMonth() + 1}月營業額`;
    if (isCurrentDaySelected) return `${new Date().getDate()}日營業額`;
    return "指定範圍 營業額";
  })();

  const secondCircularBarAmount = isCurrentYearSelected
    ? Object.values(data.year).reduce((acc, v) => acc + v.totalAmount, 0)
    : Object.values(data.detailed).reduce((acc, v) => acc + v.totalAmount, 0);

  const secondCircularBarPercentage = (() => {
    if (isCurrentYearSelected) {
      if (currentYearRevenue === 0) return 0;
      if (data.total.totalCount === 0) return 0;
      return roundUpToOneDecimalPlace(
        (currentYearRevenue / data.total.totalAmount) * 100,
      );
    }
    const currentPeriodRevenue = Object.values(data.detailed).reduce(
      (acc, v) =>
        acc +
        v.storeSimulatorAppointments[id].reduce((acc, v) => acc + v.amount, 0),
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

  const totalAppointmentCount = data.total.totalCount;

  const totalAppointmentCountForAllSites = data.total.totalCount;

  const thirdCircularBarPercentage = (() => {
    if (totalAppointmentCount === 0) return 0;

    if (totalAppointmentCountForAllSites === 0) return 0;

    return roundUpToOneDecimalPlace(
      (data.total.storeSimulatorAppointments[id].totalCount /
        totalAppointmentCountForAllSites) *
        100,
    );
  })();

  const currentPeriodSiteAppointmentCount = (() => {
    if (isCurrentYearSelected)
      return Object.values(data.year).reduce(
        (acc, v) => acc + v.storeSimulatorAppointments[id].length,
        0,
      );

    return Object.values(data.detailed).reduce(
      (acc, v) => acc + v.storeSimulatorAppointments[id].length,
      0,
    );
  })();

  const currentPeriodSiteAppointmentPercentage = (() => {
    const currentPeriodSiteAppointmentCount = Object.values(
      data.detailed,
    ).reduce((acc, v) => acc + v.storeSimulatorAppointments[id].length, 0);
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

  return (
    <section className="col-span-2 px-5 py-4 bg-white rounded-md">
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mb-4 mt-2.5 flex gap-4">
        <CircularProgressWithDesc
          filledPercentage={totalSiteRevenuePercentage}
          amount={data.total.totalAmount}
          label="總營業額"
        />
        <CircularProgressWithDesc
          filledPercentage={secondCircularBarPercentage}
          amount={secondCircularBarAmount}
          label={secondCircularBarLabel}
        />
        <CircularProgressWithDesc
          filledPercentage={thirdCircularBarPercentage}
          amount={data.total.totalCount}
          label="總訂單數"
          type="secondary"
        />
        <CircularProgressWithDesc
          filledPercentage={currentPeriodSiteAppointmentPercentage}
          amount={currentPeriodSiteAppointmentCount}
          label={lastCircularBarLabel}
          type="secondary"
        />

        <TextButton className="self-end ml-auto" onClick={() => setOpen(!open)}>
          展開訂單
        </TextButton>
      </ul>

      <ScrollArea className={open ? "max-h-[390px]" : "max-h-0"}>
        <GenericDataTable
          columns={columns}
          data={appointments.map((v) => ({
            id: v.id,
            name: v.appUser.chName,
            phone: v.appUser.phone,
            startDateTime: v.startTime,
            endDateTime: v.endTime,
            paymentType: v.order ? "信用卡" : "點數",
            amount: v.amount,
          }))}
        />
      </ScrollArea>
    </section>
  );
}
