import pencilIcon from "@/assets/pencil.svg";
import trashCanIcon from "@/assets/trash-can-icon.svg";
import { CategoryDesktopMenubar } from "@/components/category/category-desktop-menubar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-is-mobile";
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
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Modal } from "../modal";
import { CategoryMobileMenubar } from "@/components/category/category-mobile-menubar";
import { Scrollbar } from "@radix-ui/react-scroll-area";

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
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [globalFilter, setGlobalFilter] = useState("");

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

  useEffect(() => {
    if (storeId) return;
    if (stores[0]) onStoreValueChange(stores[0].id, true);
  }, [stores, onStoreValueChange, storeId]);

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <CategoryMobileMenubar
            newSiteHref={newSiteHref}
            onStoreValueChange={onStoreValueChange}
            storeId={storeId}
            stores={stores}
            type={type}
          />
        ) : (
          <CategoryDesktopMenubar
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            newSiteHref={newSiteHref}
            onStoreValueChange={onStoreValueChange}
            storeId={storeId}
            stores={stores}
            type={type}
          />
        )
      }
    >
      {({ height }) => {
        return (
          <ScrollArea
            className="w-full overflow-auto border border-line-gray bg-light-gray p-5"
            style={{ height: height }}
          >
            <div className="relative flex h-full flex-col gap-2.5">
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
                const openingWeekDays = [] as {
                  day: string;
                  hours: string;
                }[];

                if (type === "ground" || type === "simulator") {
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
                } else {
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
                }

                return (
                  <Section
                    type={type}
                    key={section.id}
                    id={section.id}
                    imgId={section.coverImages[0]}
                    name={section.name}
                    desc={section.introduce}
                    equipments={section.equipments.map((e) => e.title)}
                    openingDates={openingDates}
                    openingHours={openingHours}
                    openingWeekDays={openingWeekDays}
                    siteDetailsHref={siteDetailsHref}
                    siteDeleteHref={`/store/${type}/${section.id}`}
                  />
                );
              })}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        );
      }}
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
    <section className="grid grid-cols-[128px_1fr_150px_192px_305px_20px] gap-x-2.5 border border-line-gray bg-white p-4 xl:grid-cols-[128px_1fr_150px_192px_20px] lg:grid-cols-[128px_1fr_150px_20px]">
      {imgId ? (
        !img ? (
          <Skeleton className="mr-1.5 h-32 w-32 rounded-none bg-[#c1c1c1]" />
        ) : (
          <img src={img} className="mr-1.5 h-32 w-32 object-cover" />
        )
      ) : (
        <div className="mr-1.5 h-32 w-32 bg-[#c1c1c1]" />
      )}

      <div className="flex-1 basis-0 bg-light-gray px-4 pb-5 pt-2.5 sm:w-44">
        <h2 className="text-lg font-semibold text-secondary-purple">{name}</h2>
        <p>{desc}</p>
      </div>

      <MiddleSection
        header="場地設備"
        list={equipments}
        className="lg:hidden"
        liContentRenderer={(e) => <> {e} </>}
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
