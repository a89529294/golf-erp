import { DetailedData, YearData } from "@/pages/indoor-simulator/report/loader";
import { DataType, reportTimeRange } from "@/types-and-schemas/report";
import { fromRangeStringToLastDateSetBy } from "@/utils";
import Chart from "chart.js/auto";
import React from "react";
import { useSearchParams } from "react-router-dom";

const nf = new Intl.NumberFormat("en-us");

export function MainChart({
  data,
  rightPanelHeight,
  activeDataType,
}: {
  data: {
    year: YearData;
    detailed: DetailedData;
  };
  rightPanelHeight: number;
  activeDataType: DataType;
}) {
  const [searchParams] = useSearchParams();
  const range = searchParams.get("range")! as reportTimeRange;
  const isYearData = fromRangeStringToLastDateSetBy(range) === "year";

  React.useEffect(() => {
    const secondaryPurple = "#262873";
    const labels = isYearData
      ? Array(12)
          .fill("")
          .map((_, i) => `${(i + 1).toString().padStart(2, "0")}`)
      : Array(30)
          .fill("")
          .map((_, i) => `6/${i + 1}`);
    const yData = isYearData
      ? Object.values(data.year).map((v) => {
          return activeDataType === "revenue" ? v.totalAmount : v.totalCount;
        })
      : Array(30)
          .fill("")
          .map(() => Math.floor(Math.random() * 100000));

    if (!document.getElementById("chart")) return;
    const myChart = new Chart(
      document.getElementById("chart") as HTMLCanvasElement,
      {
        type: "line",
        plugins: [
          {
            id: "after_draw",
            afterDraw: (chart) => {
              if (chart.tooltip?.getActiveElements().length) {
                const activeElement = chart.tooltip.getActiveElements()[0];
                const x = activeElement.element.x;
                const yAxis = chart.scales.y;
                const ctx = chart.ctx;
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, yAxis.top);
                ctx.lineTo(x, yAxis.bottom);
                ctx.lineWidth = 1;
                ctx.strokeStyle = secondaryPurple;
                ctx.stroke();
                ctx.restore();
              }
            },
          },
        ],
        options: {
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: "x",
          },
          animation: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: secondaryPurple,
              displayColors: false,
              cornerRadius: 5,
              padding: 10,
              bodyFont: {
                size: 14,
                weight: 700,
              },
              titleFont: {
                size: 14,
                weight: 700,
              },
              bodyColor: "#ffffffa6",
              callbacks: {
                title(tooltipItems) {
                  return `$ ${nf.format(tooltipItems[0].parsed.y)}`;
                },
                label(tooltipItem) {
                  return `2024/${labels[tooltipItem.parsed.x]}`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                callback: function (_, index) {
                  const visibleIndex = [0, 4, 9, 14, 19, 24, 29];
                  return isYearData
                    ? this.getLabelForValue(index)
                    : visibleIndex.includes(index)
                      ? this.getLabelForValue(index)
                      : "";
                },
                color: "#858585",
                maxRotation: 0,
                minRotation: 0,
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                callback: function (val) {
                  return `$ ${val}`;
                },
                color: "#858585",
                crossAlign: "far",
                maxTicksLimit: 5,
              },
            },
          },
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: "",
              data: yData,
              fill: true,
              backgroundColor: "#88CED51A",
              segment: {
                borderColor: secondaryPurple,
                borderWidth: 1,
              },
              pointStyle: (ctx) => {
                return ctx.active ? "circle" : false;
              },
              pointBackgroundColor: "transparent",
              pointBorderColor: secondaryPurple,
              pointHoverRadius: 5,
            },
          ],
        },
      },
    );

    return () => {
      myChart?.destroy();
    };
  }, [activeDataType, data, isYearData, rightPanelHeight]);

  return <canvas id="chart" />;
}
