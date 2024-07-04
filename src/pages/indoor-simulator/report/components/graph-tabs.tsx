import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GraphNumberCell from "@/pages/indoor-simulator/report/components/graph-number-cell";
import Chart from "chart.js/auto";
import React from "react";

const nf = new Intl.NumberFormat("en-us");

// for custom tooltips
// https://www.chartjs.org/docs/latest/samples/tooltip/html.html
export default function GraphTabs() {
  React.useEffect(() => {
    const secondaryPurple = "#262873";
    const labels = Array(30)
      .fill("")
      .map((_, i) => `2024/6/${i + 1}`);
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
                  console.log(tooltipItems);
                  return `$ ${nf.format(tooltipItems[0].parsed.y)}`;
                },
                label(tooltipItem) {
                  return labels[tooltipItem.parsed.x];
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
                console.log(ctx);
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
        <div className="flex-1 rounded-md bg-white p-4">
          hi
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
