import pencilIcon from "@/assets/pencil.svg";
import plusIcon from "@/assets/plus-icon.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { StoreWithoutEmployees } from "@/pages/store-management/loader";
import { getDifferenceInHoursAndMinutes, toMinguoDate } from "@/utils";
import { equipments } from "@/utils/category/equipment";
import { genericSitesSchema } from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function CategoryMain({
  newSiteHref,
  siteDetailsHref,
  stores,
  type,
}: {
  type: "golf" | "ground" | "simulator";
  newSiteHref: string;
  siteDetailsHref: string;
  stores: StoreWithoutEmployees[];
}) {
  // const { data } = useQuery({
  //   ...queryObject,
  //   initialData,
  // });

  const [storeId, setStoreId] = useState<string>();
  const { data: sites } = useQuery({
    queryKey: ["sites-for-store", storeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/store/${storeId}/${type}?populate=*`,
      );
      const sites = genericSitesSchema.parse(await response.json()).data;

      return sites;
    },
    enabled: !!storeId,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const onStoreValueChange = (storeId: string) => {
    setStoreId(storeId);
  };

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
          <Select onValueChange={onStoreValueChange}>
            <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark">
              <SelectValue placeholder="選擇廠商" />
            </SelectTrigger>
            <SelectContent className="w-[280px]">
              {stores.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              {sites?.map((section) => {
                const openingDates = (
                  section.openDays
                    ? section.openDays.toSorted(
                        (a, b) => a.sequence - b.sequence,
                      )
                    : []
                ).map(
                  (v) =>
                    [
                      toMinguoDate(new Date(v.startDay)),
                      toMinguoDate(new Date(v.endDay)),
                    ] as const,
                );

                const openingHours = (
                  section.openTimes
                    ? section.openTimes.toSorted(
                        (a, b) => a.sequence - b.sequence,
                      )
                    : []
                ).map((v) => {
                  const startHour = +v.startTime.slice(11, 16).split(":")[0];
                  const startMin = +v.startTime.slice(11, 16).split(":")[1];
                  const endHour = +v.endTime.slice(11, 16).split(":")[0];
                  const endMin = +v.endTime.slice(11, 16).split(":")[1];
                  return {
                    hours: `${v.startTime.slice(11, 16)}～${v.endTime.slice(11, 16)}`,
                    duration: getDifferenceInHoursAndMinutes(
                      startHour * 60 + startMin,
                      endHour * 60 + endMin,
                    ),
                    fee: `${v.pricePerHour}元`,
                  };
                });

                return (
                  <Section
                    key={section.id}
                    id={section.id}
                    name={section.name}
                    desc={section.introduce}
                    equipments={equipments.slice(0, 5)}
                    openingDates={openingDates}
                    openingHours={openingHours}
                    siteDetailsHref={siteDetailsHref}
                  />
                );
              })}
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
  openingDates: Readonly<[string, string]>[];
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
            <div className="w-1" />
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
