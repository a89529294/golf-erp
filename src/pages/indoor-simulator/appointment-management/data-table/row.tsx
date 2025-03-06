import React, { useEffect, useRef, useState } from "react";
import { Appointment } from "@/types-and-schemas/appointment";
import gsap from "gsap";
import "./countdown.css";
import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender, RowModel } from "@tanstack/react-table";

interface FigureProps {
  value: string;
  type: "hours" | "min" | "sec";
  position: "1" | "2";
}

function Figure({ value, type, position }: FigureProps) {
  const figureRef = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (value !== currentValue && figureRef.current) {
      // Get references to the DOM elements
      const $top = figureRef.current.querySelector(".top") as HTMLElement;
      const $bottom = figureRef.current.querySelector(".bottom") as HTMLElement;
      const $backTop = figureRef.current.querySelector(
        ".top-back span",
      ) as HTMLElement;
      const $backBottom = figureRef.current.querySelector(
        ".bottom-back span",
      ) as HTMLElement;

      // Before we begin, change the back value
      if ($backTop) $backTop.textContent = value;
      if ($backBottom) $backBottom.textContent = value;

      // Then animate
      gsap.to($top, {
        rotationX: "-180deg",
        transformPerspective: 300,
        duration: 0.8,
        ease: "power4.out",
        onComplete: function () {
          // Update the top and bottom values after animation completes
          if ($top) $top.textContent = value;
          if ($bottom) $bottom.textContent = value;

          // Reset the top rotation
          gsap.set($top, { rotationX: 0 });

          // Update the state
          setCurrentValue(value);
        },
      });

      // Animate the back top at the same time
      const $topBack = figureRef.current.querySelector(
        ".top-back",
      ) as HTMLElement;
      if ($topBack) {
        gsap.to($topBack, {
          rotationX: 0,
          transformPerspective: 300,
          duration: 0.8,
          ease: "power4.out",
          clearProps: "all",
        });
      }
    }
  }, [value, currentValue]);

  return (
    <div className={`figure ${type} ${type}-${position}`} ref={figureRef}>
      <span className="top">{currentValue}</span>
      <span className="top-back">
        <span>{currentValue}</span>
      </span>
      <span className="bottom">{currentValue}</span>
      <span className="bottom-back">
        <span>{currentValue}</span>
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  hours: number;
  minutes: number;
  seconds?: number;
}

function CountdownTimer({ hours, minutes, seconds = 0 }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours,
    minutes,
    seconds,
  });

  const formatNumber = (num: number): [string, string] => {
    const str = num.toString().padStart(2, "0");
    return [str[0], str[1]];
  };

  const [hour1, hour2] = formatNumber(timeLeft.hours);
  const [min1, min2] = formatNumber(timeLeft.minutes);
  const [sec1, sec2] = formatNumber(timeLeft.seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        if (newHours < 0) {
          clearInterval(interval);
          return prev;
        }

        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown">
      <div className="bloc-time hours" data-init-value={hours}>
        <span className="count-title text-sm font-medium text-secondary-dark">
          時
        </span>

        <Figure value={hour1} type="hours" position="1" />
        <Figure value={hour2} type="hours" position="2" />
      </div>

      <div className="bloc-time min" data-init-value={minutes}>
        <span className="count-title text-sm font-medium text-secondary-dark">
          分
        </span>

        <Figure value={min1} type="min" position="1" />
        <Figure value={min2} type="min" position="2" />
      </div>

      <div className="bloc-time sec" data-init-value={seconds}>
        <span className="count-title text-sm font-medium text-secondary-dark">
          秒
        </span>

        <Figure value={sec1} type="sec" position="1" />
        <Figure value={sec2} type="sec" position="2" />
      </div>
    </div>
  );
}

function getRemainingTime(startTimeStr: string, endTimeStr: string) {
  const startTime = new Date(startTimeStr.replace(" ", "T"));
  const endTime = new Date(endTimeStr.replace(" ", "T"));

  // Deduct 8 hours from both startTime and endTime
  startTime.setHours(startTime.getHours() - 8);
  endTime.setHours(endTime.getHours() - 8);

  const now = new Date();

  if (now < startTime || now > endTime) return null;

  // Calculate difference in milliseconds
  const diffMs = endTime.getTime() - now.getTime();

  if (diffMs <= 0) return null;

  // Convert to hours, minutes, seconds
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function Row({ row }: { row: RowModel<Appointment>["rows"][number] }) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getRemainingTime(
      row.original.id === "02432248-c2d8-4e45-a7af-ff79de04d62c"
        ? "2025-03-05 08:00"
        : row.original.startTime,
      row.original.id === "02432248-c2d8-4e45-a7af-ff79de04d62c"
        ? "2025-03-05 12:00"
        : row.original.endTime,
    ),
  );

  const originAmount =
    row.original.originAmount ??
    row.original.amount + (row.original.usedCoupon?.[0]?.amount ?? 0);
  const percentOff = (
    ((originAmount - row.original.amount) / originAmount) *
    100
  ).toFixed(2);

  // TODO replace hardcoded time with row.original.startTime and row.original.endTime

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeRemaining((tr) => {
        const newestRemainingTime = getRemainingTime(
          row.original.startTime,
          row.original.endTime,
        );
        if (newestRemainingTime && tr) return tr;
        return newestRemainingTime;
      });
    }, 10000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [row.original.endTime, row.original.startTime]);

  useEffect(() => {
    // if (row.original.id === "b133ab6b-92fa-454f-95b6-616f69f03827") {
    //   console.log(row.original);
    // }

    setTimeRemaining(
      getRemainingTime(row.original.startTime, row.original.endTime),
    );

    return () => {
      setTimeRemaining(null);
    };
  }, [row.original.id]);

  return (
    <>
      <TableRow
        key={row.id + "1"}
        data-state={row.getIsSelected() && "selected"}
        className="hl-next-tr group bg-white"
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
      <TableRow
        key={row.id + "2"}
        data-state={row.getIsSelected() && "selected"}
        className="group bg-white"
      >
        <TableCell colSpan={6} className="border-b border-line-gray pt-0">
          <div className="flex gap-2.5">
            <div className="flex gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
              <div className="w-24">
                <p className="text-sm font-medium text-secondary-dark">
                  付款方式
                </p>
                <p className="text-secondary-purple">
                  {row.original.order?.paymentMethod ?? "點數"}
                </p>
              </div>
              <div className="w-14">
                <p className="text-sm font-medium text-secondary-dark">狀態</p>
                <p className="text-secondary-purple">{row.original.status}</p>
              </div>
            </div>

            <div className="flex gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-secondary-dark">
                  原訂單金額
                </p>
                <p className="text-secondary-purple">{originAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-dark">折數%</p>
                <p className="text-secondary-purple">{percentOff}</p>
              </div>

              <div className="w-36">
                <p className="text-sm font-medium text-secondary-dark">
                  優惠券名稱
                </p>
                <p className="truncate text-secondary-purple">
                  {row.original.usedCoupon?.[0]?.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-secondary-dark">
                  優惠券金額
                </p>
                <p className="text-secondary-purple">
                  {row.original.usedCoupon?.[0]?.amount}
                </p>
              </div>

              <div className="w-10">
                <p className="text-sm font-medium text-secondary-dark">折扣</p>
                <p className="text-secondary-purple">
                  {originAmount - row.original.amount}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-secondary-dark">
                  實際付款金額
                </p>
                <p className="text-secondary-purple">{row.original.amount}</p>
              </div>
            </div>

            <div className="r h-full">
              {timeRemaining && (
                <CountdownTimer
                  hours={timeRemaining.hours}
                  minutes={timeRemaining.minutes}
                  seconds={timeRemaining.seconds}
                />
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
