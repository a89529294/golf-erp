import { CircularProgressBar } from "@/components/circular-progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraphNumberCell from "@/pages/indoor-simulator/report/components/graph-number-cell";
import { GraphRevenueCell } from "@/pages/indoor-simulator/report/components/graph-revenue-cell";
import { TextButton } from "@/pages/indoor-simulator/report/components/text-button";
import Chart from "chart.js/auto";
import React from "react";

const nf = new Intl.NumberFormat("en-us");

// for custom tooltips
// https://www.chartjs.org/docs/latest/samples/tooltip/html.html
export default function GraphTabs() {
  const [graphDateRange, setGraphDateRange] = React.useState([
    new Date(),
    new Date(),
  ]);

  React.useEffect(() => {
    const secondaryPurple = "#262873";
    const labels = Array(30)
      .fill("")
      .map((_, i) => `6/${i + 1}`);
    const data = Array(30)
      .fill("")
      .map(() => Math.floor(Math.random() * 100000));

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
                  return visibleIndex.includes(index)
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
              },
            },
          },
        },
        data: {
          labels: labels,
          datasets: [
            {
              label: "",
              data: data,
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
      myChart.destroy();
    };
  }, []);

  const setDay = () => setGraphDateRange([new Date(), new Date()]);
  const setMonth = () => {
    const date = new Date();
    setGraphDateRange([
      new Date(date.getFullYear(), date.getMonth(), 1),
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
    ]);
  };
  const setYear = () => {
    const date = new Date();
    setGraphDateRange([
      new Date(date.getFullYear(), 0, 1),
      new Date(date.getFullYear() + 1, 0, 0),
    ]);
  };

  console.log(graphDateRange);

  return (
    <Tabs defaultValue="revenue" className="flex flex-col gap-2.5">
      <TabsList className="space-x-3 self-center bg-transparent">
        <TabsTrigger
          className="rounded-full border border-line-gray bg-white px-5 py-2 text-secondary-dark data-[state=active]:border-none data-[state=active]:bg-secondary-dark data-[state=active]:text-white"
          value="revenue"
        >
          總營業額
        </TabsTrigger>
        <TabsTrigger
          className="rounded-full border border-line-gray bg-white px-5 py-2 text-secondary-dark data-[state=active]:border-none data-[state=active]:bg-secondary-dark data-[state=active]:text-white"
          value="number-of-orders"
        >
          總訂單數
        </TabsTrigger>
      </TabsList>
      <TabsContent value="revenue" className="flex gap-2.5">
        <div className="flex-1 space-y-2 rounded-md bg-white p-4">
          <div className="flex gap-2.5">
            <GraphRevenueCell title="總營業額" amount={23400000} />
            <GraphRevenueCell
              title="6月營業額"
              amount={1100000}
              leftSlot={<CircularProgressBar size={60} filledPercentage={60} />}
            />
            <div className="ml-auto space-x-1.5">
              <TextButton onClick={setDay}>日</TextButton>
              <TextButton onClick={setMonth}>月</TextButton>
              <TextButton onClick={setYear}>年</TextButton>
            </div>
          </div>
          <canvas id="chart" />
        </div>
        <div className=" w-[267px] rounded-md bg-white p-4">
          <GraphNumberCell
            title="2024 營收"
            subTitle={
              <>
                6月 年增率
                <span className="flex items-center text-line-green">
                  +10%
                  <div className="size-0 border-x-[3.75px] border-b-[8.66px] border-x-transparent border-b-line-green" />
                </span>
              </>
            }
            number={11000000}
          />
          <div className="border-b border-line-gray" />
          <GraphNumberCell
            title="去年 同期營收"
            subTitle={<>6月</>}
            number={10000000}
            secondary
          />

          <div className="mt-4 rounded-md bg-line-green/10 py-5 text-center text-3xl text-line-green">
            +{nf.format(10000000)}
          </div>
        </div>
      </TabsContent>
      {/* <TabsContent value="number-of-orders ">
        Change your password here.
      </TabsContent> */}
    </Tabs>
  );
}
