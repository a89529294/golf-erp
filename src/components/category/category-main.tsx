import pencilIcon from "@/assets/pencil.svg";
import plusIcon from "@/assets/plus-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function CategoryMain<
  K extends {
    id: string;
    name: string;
    desc: string;
    equipments: {
      id: string;
      label: string;
      selected: boolean;
    }[];
    openingDates: [string, string][];
    openingHours: { hours: string; duration: string; fee: string }[];
  }[],
>({
  initialData,
  queryObject,
  newSiteHref,
  siteDetailsHref,
}: {
  initialData: K;
  queryObject: UseQueryOptions<K>;
  newSiteHref: string;
  siteDetailsHref: string;
}) {
  const { data } = useQuery({
    ...queryObject,
    initialData,
  });

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
          <Link to={newSiteHref} className={button()} id="new-site-link">
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
              {data!.map((section) => (
                <Section
                  key={section.id}
                  id={section.id}
                  name={section.name}
                  desc={section.desc}
                  equipments={section.equipments}
                  openingDates={section.openingDates}
                  openingHours={section.openingHours}
                  siteDetailsHref={siteDetailsHref}
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
  id,
  name,
  desc,
  equipments,
  openingDates,
  openingHours,
  siteDetailsHref,
}: {
  id: string;
  name: string;
  desc: string;
  equipments: {
    id: string;
    label: string;
    selected: boolean;
  }[];
  openingDates: [string, string][];
  openingHours: {
    hours: string;
    duration: string;
    fee: string;
  }[];
  siteDetailsHref: string;
}) {
  return (
    <section className="flex gap-2.5 border border-line-gray bg-white p-4">
      <div className="mr-1.5 h-32 w-32 bg-[#c1c1c1]" />

      <div className="flex-1 basis-0 bg-light-gray px-4 pb-5 pt-2.5">
        <h2 className="text-lg font-semibold text-secondary-purple">{name}</h2>
        <p>{desc}</p>
      </div>

      <MiddleSection
        header="場地設備"
        list={equipments}
        liContentRenderer={(e) => <>{e.label}</>}
        useOrderedList
      />

      <MiddleSection
        header="場地開放日期"
        list={openingDates}
        liContentRenderer={(d) => (
          <>
            {d[0]}
            <span>～</span>
            {d[1]}
          </>
        )}
      />

      <MiddleSection
        header="場地開放時間"
        list={openingHours}
        liContentRenderer={(h) => (
          <>
            {h.hours}
            <span className="px-2.5 text-line-gray">|</span>
            {h.duration}
            {h.fee}
          </>
        )}
      />

      <div className="flex flex-col gap-4 self-start">
        <Link to={siteDetailsHref + id}>
          <img src={pencilIcon} />
        </Link>
        <button>
          <img src={trashCanIcon} />
        </button>
      </div>
    </section>
  );
}

function MiddleSection<T>({
  header,
  useOrderedList,
  list,
  liContentRenderer,
}: {
  header: string;
  useOrderedList?: boolean;
  list: T[];
  liContentRenderer: (arg: T) => React.ReactElement;
}) {
  const As = useOrderedList ? "ol" : "ul";
  return (
    <div className="w-min basis-0 whitespace-nowrap bg-light-gray px-4 pb-5 pt-2.5">
      <h2 className="text-lg font-semibold text-word-darker-gray">{header}</h2>
      <As
        className={cn(
          "space-y-1",
          useOrderedList && "list-inside list-decimal",
        )}
      >
        {list.map((h, i) => (
          <li key={i} className="">
            {/* this wrapper is necessary if you set li to flex, the list marker disappears */}
            <div className="inline-flex justify-between font-mono ">
              {liContentRenderer(h)}
            </div>
          </li>
        ))}
      </As>
    </div>
  );
}
