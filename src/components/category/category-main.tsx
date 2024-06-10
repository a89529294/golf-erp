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
import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { StoreWithoutEmployees } from "@/pages/store-management/loader";
import {
  fromImageIdsToSrc,
  getDifferenceInHoursAndMinutes,
  toMinguoDate,
} from "@/utils";
import {
  golfSitesSchema,
  groundSitesSchema,
  simulatorSitesSchema,
} from "@/utils/category/schemas";
import { privateFetch } from "@/utils/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../modal";

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
  const navigate = useNavigate();
  const { storeId } = useParams();
  const {
    data: sites,
    isPending,
    fetchStatus,
  } = useQuery({
    queryKey: ["sites-for-store", storeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/store/${storeId}/${type}?populate=*`,
      );
      const schemaMap = {
        ground: groundSitesSchema,
        simulator: simulatorSitesSchema,
        golf: golfSitesSchema,
      };
      const sites = schemaMap[type].parse(await response.json()).data;

      return sites;
    },
    enabled: !!storeId,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const onStoreValueChange = useCallback(
    (storeId: string) => {
      if (type === "ground")
        navigate(`/driving-range/site-management/${storeId}`);
      else if (type === "golf") navigate(`/golf/site-management/${storeId}`);
      else if (type === "simulator")
        navigate(`/indoor-simulator/site-management/${storeId}`);
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
    if (stores[0]) onStoreValueChange(stores[0].id);
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
          <Select value={storeId} onValueChange={onStoreValueChange}>
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
              {isPending && fetchStatus === "idle" && (
                <p className="font-medium">請先選廠商</p>
              )}
              {isPending && fetchStatus === "fetching" && (
                <div
                  className="absolute inset-0 flex h-full items-center justify-center"
                  style={{ height: height - 42 }}
                >
                  <Spinner />
                </div>
              )}
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
  siteDetailsHref: string;
  siteDeleteHref: string;
}) {
  const queryClient = useQueryClient();
  const [img, setImg] = useState("");

  useEffect(() => {
    if (!imgId) return;
    (async () => {
      const src = await fromImageIdsToSrc([imgId]);
      setImg(src[0]);
    })();
  }, [imgId]);

  return (
    <section className="grid grid-cols-[128px_1fr_120px_192px_305px_20px] gap-x-2.5 border border-line-gray bg-white p-4">
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
        {/* TODO remove the check once golf is working  */}
        {type !== "golf" && (
          <Link to={`${siteDetailsHref}/${id}`}>
            <img src={pencilIcon} />
          </Link>
        )}
        <Modal
          dialogTriggerChildren={
            <button>
              <img src={trashCanIcon} />
            </button>
          }
          title={`確認刪除${name}?`}
          onSubmit={async () => {
            await privateFetch(siteDeleteHref, {
              method: "DELETE",
            });
            queryClient.invalidateQueries({ queryKey: ["sites-for-store"] });
          }}
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
}: {
  header: string;
  useOrderedList?: boolean;
  list: T[];
  liContentRenderer: (arg: T) => React.ReactElement;
}) {
  const As = useOrderedList ? "ol" : "ul";
  return (
    <div className="flex flex-col items-center whitespace-nowrap bg-light-gray pb-5 pt-2.5">
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
