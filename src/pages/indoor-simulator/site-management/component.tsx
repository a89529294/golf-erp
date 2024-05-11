import plusIcon from "@/assets/plus-icon.svg";
import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { linksKV } from "@/utils/links";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import pencilIcon from "@/assets/pencil.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";

const sections = [
  {
    id: "1",
    name: "場地A",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
  {
    id: "2",
    name: "場地B",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
  {
    id: "3",
    name: "場地C",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
  {
    id: "4",
    name: "場地E",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
  {
    id: "5",
    name: "場地F",
    desc: "說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介說明簡介",
    openingDates: [
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
      ["113-07-01", "113-10-01"],
    ] as [string, string][],
    openingHours: [
      { hours: "00:00~06:59", duration: "7 小時", fee: "100 元" },
      { hours: "07:00~12:00", duration: "5 小時", fee: "200 元" },
    ],
  },
];

export function Component() {
  const [globalFilter, setGlobalFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);

      const setHeightIfRef = () =>
        ref.current && setHeight(ref.current.clientHeight);
      window.addEventListener("resize", setHeightIfRef);

      return () => window.removeEventListener("resize", setHeightIfRef);
    }
  }, []);

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            to={
              linksKV["indoor-simulator"].subLinks["site-management"].paths.new
            }
            className={button()}
            id="new-site-link"
          >
            <img src={plusIcon} />
            新增場地
          </Link>
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
        </>
      }
    >
      <div className="w-full" ref={ref}>
        <ScrollArea
          className="mb-2.5 w-full  overflow-auto border border-line-gray bg-light-gray p-5"
          style={{ height }}
        >
          {height && (
            <div className="space-y-2.5">
              {sections.map((section) => (
                <Section
                  key={section.id}
                  name={section.name}
                  desc={section.desc}
                  openingDates={section.openingDates}
                  openingHours={section.openingHours}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}

function Section({
  name,
  desc,
  openingDates,
  openingHours,
}: {
  name: string;
  desc: string;
  openingDates: [string, string][];
  openingHours: {
    hours: string;
    duration: string;
    fee: string;
  }[];
}) {
  return (
    <section className="flex gap-4 border border-line-gray bg-white p-4">
      <div className="h-32 w-32 bg-[#c1c1c1]" />
      <div className="grow-[89] basis-0 bg-light-gray px-4 pb-5 pt-2.5">
        <h2 className="text-secondary-purple text-lg font-semibold">{name}</h2>
        <p>{desc}</p>
      </div>
      <div className="grow-[42] basis-0 bg-light-gray px-4 pb-5 pt-2.5">
        <h2 className="text-word-darker-gray text-lg font-semibold">
          場地開放日期
        </h2>
        {openingDates.map((d, i) => (
          <p key={i} className="flex justify-between font-mono">
            {d[0]}
            <span>~</span>
            {d[1]}
          </p>
        ))}
      </div>
      <div className="grow-[56] basis-0 bg-light-gray px-4 pb-5 pt-2.5">
        <h2 className="text-word-darker-gray text-lg font-semibold">
          場地開放日期
        </h2>
        {openingHours.map((h, i) => (
          <p key={i} className="flex justify-between font-mono">
            {h.hours}
            <span>|</span>
            {h.duration}
            <span>|</span>
            {h.fee}
          </p>
        ))}
      </div>
      <div className="flex flex-col gap-4 self-start">
        <button>
          <img src={pencilIcon} />
        </button>
        <button>
          <img src={trashCanIcon} />
        </button>
      </div>
    </section>
  );
}
