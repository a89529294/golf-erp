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
import { Skeleton } from "@/components/ui/skeleton";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import {
  GolfStoreWithSites,
  GroundStoreWithSites,
  SimulatorStoreWithSites,
} from "@/pages/store-management/loader";
import {
  fromImageIdsToSrc,
  getDifferenceInHoursAndMinutes,
  numberToWeekDay,
  toMinguoDate,
} from "@/utils";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../modal";
import React from "react";
import { toast } from "sonner";

export function CategoryMain({
  newSiteHref,
  siteDetailsHref,
  stores,
  type,
}: {
  newSiteHref: string;
  siteDetailsHref: string;
  type: "ground";
  stores: GroundStoreWithSites[];
}): React.JSX.Element;
export function CategoryMain({
  newSiteHref,
  siteDetailsHref,
  stores,
  type,
}: {
  newSiteHref: string;
  siteDetailsHref: string;
  type: "simulator";
  stores: SimulatorStoreWithSites[];
}): React.JSX.Element;
export function CategoryMain({
  newSiteHref,
  siteDetailsHref,
  stores,
  type,
}: {
  newSiteHref: string;
  siteDetailsHref: string;
  type: "golf";
  stores: GolfStoreWithSites[];
}): React.JSX.Element;
export function CategoryMain({
  newSiteHref,
  siteDetailsHref,
  stores,
  type,
}: {
  type: "golf" | "ground" | "simulator";
  newSiteHref: string;
  siteDetailsHref: string;
  stores:
    | GolfStoreWithSites[]
    | GroundStoreWithSites[]
    | SimulatorStoreWithSites[];
}): React.JSX.Element {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [globalFilter, setGlobalFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const sites = stores.find((store) => store.id === storeId)?.sites;

  const onStoreValueChange = useCallback(
    (storeId: string, replace: boolean) => {
      if (type === "ground")
        navigate(`/driving-range/site-management/${storeId}`, { replace });
      else if (type === "golf")
        navigate(`/golf/site-management/${storeId}`, { replace });
      else if (type === "simulator")
        navigate(`/indoor-simulator/site-management/${storeId}`, { replace });
    },
    [navigate, type],
  );

  useLayoutEffect(() => {
    const setHeightIfRef = () =>
      ref.current && setHeight(ref.current.clientHeight - 10); // - 10 because of pb-2.5
    setHeightIfRef();

    window.addEventListener("resize", setHeightIfRef);

    return () => window.removeEventListener("resize", setHeightIfRef);
  }, []);

  useEffect(() => {
    if (storeId) return;
    if (stores[0]) onStoreValueChange(stores[0].id, true);
  }, [stores, onStoreValueChange, storeId]);

  return (
    <MainLayout
      headerChildren={
        <>
          <Link to={newSiteHref} className={button()} id="new-site-link">
            <img src={plusIcon} />
            新增場地
          </Link>
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
          <Select
            value={storeId}
            onValueChange={(v) => onStoreValueChange(v, false)}
          >
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
      <div className="w-full flex-1 pb-2.5" ref={ref}>
        <ScrollArea
          className="w-full overflow-auto border border-line-gray bg-light-gray p-5"
          style={{ height: height }}
        >
          {height && (
            <div className="relative flex h-full flex-col gap-2.5">
              {/* {isPending && fetchStatus === "idle" && (
                <p className="font-medium">請先選廠商</p>
              )}
              {isPending && fetchStatus === "fetching" && (
                <div
                  className="absolute inset-0 flex items-center justify-center h-full"
                  style={{ height: height - 42 }}
                >
                  <Spinner />
                </div>
              )} */}
              {!sites || (sites.length === 0 && <h2>查無資料</h2>)}
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

                const openingHours = [] as {
                  hours: string;
                  duration: string;
                  fee: string;
                }[];
                const openingWeekDays = [] as { day: string; hours: string }[];

                if (type === "ground") {
                  (section.openTimes
                    ? section.openTimes.toSorted(
                        (a, b) => a.sequence - b.sequence,
                      )
                    : []
                  ).forEach((v) => {
                    const startTime = v.startTime.slice(11, 16);
                    const startHour = +startTime.split(":")[0];
                    const startMin = +startTime.split(":")[1];
                    const endTime = v.endTime.slice(11, 16);
                    const endHour = +endTime.split(":")[0];
                    const endMin = +endTime.split(":")[1];
                    openingHours.push({
                      hours: `${startTime}～${endTime}`,
                      duration: getDifferenceInHoursAndMinutes(
                        startHour * 60 + startMin,
                        endHour * 60 + endMin,
                      ),
                      fee: "pricePerHour" in v ? `${v.pricePerHour}元` : "0元",
                    });
                  });
                } else if (type === "golf") {
                  section.openTimes
                    ?.sort((a, b) => a.sequence - b.sequence)
                    .forEach((s) => {
                      if ("day" in s)
                        openingWeekDays.push({
                          day: numberToWeekDay[
                            s.day as keyof typeof numberToWeekDay
                          ],
                          hours: `${s.startTime.slice(11, 16)}～${s.endTime.slice(11, 16)}`,
                        });
                    });
                } else {
                  console.log(section.openTimes);
                  if (section.openTimes) {
                    section.openTimes.sort((a, b) => a.sequence - b.sequence);
                    section.openTimes.forEach((o) =>
                      openingHours.push({
                        hours: `${o.startTime.slice(0, 5)}~${o.endTime.slice(0, 5)}`,
                        duration: getDifferenceInHoursAndMinutes(
                          +o.startTime.slice(0, 2) * 60 +
                            +o.startTime.slice(3, 5),
                          +o.endTime.slice(0, 2) * 60 + +o.endTime.slice(3, 5),
                        ),
                        fee: "",
                      }),
                    );
                  }
                }

                return (
                  <Section
                    type={type}
                    key={section.id}
                    id={section.id}
                    imgId={section.coverImages[0]}
                    name={section.name}
                    desc={section.introduce}
                    equipments={(
                      JSON.parse(section.equipment ?? "[]") as {
                        name: string;
                        isActive: boolean;
                      }[]
                    )
                      .filter((e) => e.isActive)
                      .map((e) => e.name)}
                    openingDates={openingDates}
                    openingHours={openingHours}
                    openingWeekDays={openingWeekDays}
                    siteDetailsHref={siteDetailsHref}
                    siteDeleteHref={`/store/${type}/${section.id}`}
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
  type,
  name,
  imgId,
  desc,
  equipments,
  openingDates,
  openingHours,
  openingWeekDays,
  siteDetailsHref,
  siteDeleteHref,
}: {
  id: string;
  type: "golf" | "ground" | "simulator";
  name: string;
  imgId: string | undefined;
  desc: string;
  equipments: string[];
  openingDates: Readonly<[string, string]>[];
  openingHours: {
    hours: string;
    duration: string;
    fee: string;
  }[];
  openingWeekDays: { day: string; hours: string }[];
  siteDetailsHref: string;
  siteDeleteHref: string;
}) {
  const queryClient = useQueryClient();
  const [img, setImg] = useState("");
  const { mutateAsync } = useMutation({
    mutationKey: ["delete-site"],
    mutationFn: async () => {
      await privateFetch(siteDeleteHref, {
        method: "DELETE",
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["sites-for-store"] });
      toast.success("刪除成功");
    },
    onError() {
      toast.error("刪除失敗, 請先確認該場地是否有預約");
    },
  });

  useEffect(() => {
    if (!imgId) return;
    (async () => {
      const src = await fromImageIdsToSrc([imgId]);
      setImg(src[0]);
    })();
  }, [imgId]);

  return (
    <section className="grid grid-cols-[128px_1fr_150px_192px_305px_20px] gap-x-2.5 border border-line-gray bg-white p-4 lg:grid-cols-[128px_1fr_150px_20px] xl:grid-cols-[128px_1fr_150px_192px_20px]">
      {imgId ? (
        !img ? (
          <Skeleton className="mr-1.5 h-32 w-32 rounded-none bg-[#c1c1c1]" />
        ) : (
          <img src={img} className="mr-1.5 h-32 w-32 object-cover" />
        )
      ) : (
        <div className="mr-1.5 h-32 w-32 bg-[#c1c1c1]" />
      )}

      <div className="flex-1 basis-0 bg-light-gray px-4 pb-5 pt-2.5">
        <h2 className="text-lg font-semibold text-secondary-purple">{name}</h2>
        <p>{desc}</p>
      </div>

      <MiddleSection
        header="場地設備"
        list={equipments}
        liContentRenderer={(e) => <>{e}</>}
        useOrderedList
      />

      <MiddleSection
        alignCenter
        className="lg:hidden"
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

      {type === "golf" ? (
        <MiddleSection
          alignCenter
          className="xl:hidden"
          header="場地開放時間"
          list={openingWeekDays}
          liContentRenderer={(h) => (
            <>
              {h.day}
              <span className="px-2.5 text-line-gray">|</span>
              {h.hours}
            </>
          )}
        />
      ) : (
        <MiddleSection
          alignCenter
          className="xl:hidden"
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
      )}

      <div className="flex flex-col gap-4 self-start">
        <Link to={`${siteDetailsHref}/${id}`}>
          <img src={pencilIcon} />
        </Link>

        <Modal
          dialogTriggerChildren={
            <button>
              <img src={trashCanIcon} />
            </button>
          }
          title={`確認刪除${name}?`}
          onSubmit={mutateAsync}
        />
      </div>
    </section>
  );
}

function MiddleSection<T>({
  header,
  useOrderedList,
  list,
  liContentRenderer,
  className,
  alignCenter,
}: {
  header: string;
  useOrderedList?: boolean;
  list: T[];
  liContentRenderer: (arg: T) => React.ReactElement;
  className?: string;
  alignCenter?: boolean;
}) {
  console.log(list);
  const As = useOrderedList ? "ol" : "ul";
  return (
    <div
      className={cn(
        "flex flex-col items-center whitespace-nowrap bg-light-gray pb-5 pt-2.5",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-word-darker-gray">{header}</h2>
      <As
        className={cn(
          "w-full space-y-1 px-2.5",
          useOrderedList && "list-inside list-decimal",
          alignCenter && "text-center",
        )}
      >
        {list.map((h, i) => {
          console.log(h);
          return (
            <li key={i} className="">
              {/* this wrapper is necessary if you set li to flex, the list marker disappears */}
              <div className="inline-flex justify-between font-mono ">
                {liContentRenderer(h)}
              </div>
            </li>
          );
        })}
      </As>
    </div>
  );
}
