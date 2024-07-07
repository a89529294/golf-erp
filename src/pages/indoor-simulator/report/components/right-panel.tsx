import GraphNumberCell from "@/pages/indoor-simulator/report/components/graph-number-cell";
import React from "react";

const nf = new Intl.NumberFormat("en-us");

export const RightPanel = React.forwardRef<HTMLDivElement>(
  function (props, ref) {
    console.log(props);
    return (
      <div ref={ref} className="w-[267px] rounded-md bg-white p-4">
        <GraphNumberCell
          title="2024 營收"
          subTitle={
            <>
              6月 年增率
              <span className="flex items-center text-line-green">
                +10%
                <div className="ml-1 size-0 border-x-[3.75px] border-b-[8.66px] border-x-transparent border-b-line-green" />
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
    );
  },
);
