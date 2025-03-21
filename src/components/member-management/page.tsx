import { SearchInput } from "@/components/search-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import qs from "query-string";

import { privateFetch } from "@/utils/utils";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { columns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { StoreSelect } from "@/components/category/store-select";
import { useAuth } from "@/hooks/use-auth";
import useMediaQuery from "@/hooks/use-media-query";
import { LayoutGroup } from "framer-motion";
import { IconWarningButton } from "@/components/ui/button";
import { SendCouponModal } from "@/pages/member-management/members/components/send-coupon-modal/send-coupon-modal";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { button } from "@/components/ui/button-cn";
import { SortingState } from "@tanstack/react-table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { appUserTypeFromChinese } from "@/constants/appuser-type";

const navigateMap = {
  ground: "/driving-range/member-management",
  golf: "/golf/member-management",
  simulator: "/indoor-simulator/member-management",
};

export function MemberManagementPage({
  category,
  loader,
}: {
  category: "ground" | "simulator" | "golf";
  loader: () => Promise<
    {
      id: string;
      name: string;
    }[]
  >;
}) {
  const headerRowRef = useRef<HTMLTableRowElement>(null);
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const auth = useAuth();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "account", desc: true },
  ]);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedGlobalFilter = useDebouncedValue(globalFilter, 500);
  const isSearchActive = isSearchFocused ? true : !!globalFilter;
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: [
      category,
      "members",
      storeId,
      page,
      sorting[0].id,
      sorting[0].desc ? "DESC" : "ASC",
      debouncedGlobalFilter,
    ],
    queryFn: async () => {
      const queryString = qs.stringify({
        page: page,
        pageSize: 10,
        sort: sorting[0].id,
        order: sorting[0].desc ? "DESC" : "ASC",
        populate: ["storeAppUsers", "appChargeHistories.store"],
      });
      const encodedFilter = encodeURIComponent(debouncedGlobalFilter);
      const encodedAppUserType = encodeURIComponent(
        appUserTypeFromChinese[debouncedGlobalFilter],
      );
      const filterString = debouncedGlobalFilter
        ? `&filter[$or][account][$containsi]=${encodedFilter}&filter[$or][appUserType][$containsi]=${encodedAppUserType}&filter[$or][chName][$containsi]=${encodedFilter}&filter[$or][phone][$containsi]=${encodedFilter}&filter[$or][gender][$containsi]=${encodedFilter}&filter[$or][birthday][$containsi]=${encodedFilter}`
        : "";

      const response = await privateFetch(
        `/app-users?${queryString}${filterString}`,
      );

      // const response = await privateFetch(
      //   `/app-users/${category}/${storeId}?populate=storeAppUsers&pageSize=10&page=${page}&populate=appChargeHistories.store&sort=${sorting[0].id}&order=${sorting[0].desc ? "DESC" : "ASC"}&filter=${debouncedGlobalFilter}`,
      // );
      const data = await response.json();
      return data;
    },
    enabled: !!storeId,
    throwOnError: false,
  });

  console.log(data);

  return (
    <MainLayout
      headerChildren={
        isMobile ? (
          <div className="flex items-center gap-1 ">
            <Menubar
              value={value}
              onValueChange={setValue}
              className="h-auto border-none bg-transparent"
            >
              <MenubarMenu value="category-mobile-menu">
                <MenubarTrigger className={button()}>選項</MenubarTrigger>
                <MenubarContent>
                  {storeId && (
                    <MenubarItem onClick={(e) => e.preventDefault()}>
                      <SendCouponModal
                        show={true}
                        userIds={Object.keys(rowSelection)}
                        onClose={() => setValue("")}
                        storeId={storeId}
                        resetUserIds={() => setRowSelection({})}
                      />
                    </MenubarItem>
                  )}
                  {Object.keys(rowSelection).length > 0 && (
                    <MenubarItem onClick={(e) => e.preventDefault()}>
                      <IconWarningButton
                        onClick={() => setRowSelection({})}
                        icon="minus"
                      >
                        清空已選則
                      </IconWarningButton>
                    </MenubarItem>
                  )}
                  {storeId && (
                    <MenubarItem onClick={(e) => e.preventDefault()}>
                      <SendCouponModal
                        storeId={storeId}
                        show={!isSearchActive}
                        userIds={"all"}
                      />
                    </MenubarItem>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <StoreSelect
              category={category}
              initialData={initialData}
              navigateTo={navigateMap[category]}
            />
            <SearchInput
              mobileWidth={120}
              value={globalFilter}
              setValue={(v) => {
                setGlobalFilter(v);
                setPage(1);
              }}
            />
          </div>
        ) : (
          <>
            <StoreSelect
              category={category}
              initialData={initialData}
              navigateTo={navigateMap[category]}
            />
            <LayoutGroup>
              <SearchInput
                // className="sm:hidden"
                value={globalFilter}
                setValue={(v) => {
                  setGlobalFilter(v);
                  setPage(1);
                }}
                isFocused={isSearchFocused}
                setIsFocused={setIsSearchFocused}
              />

              {storeId && (
                <SendCouponModal
                  storeId={storeId}
                  show={!isSearchActive}
                  userIds={Object.keys(rowSelection)}
                  resetUserIds={() => setRowSelection({})}
                />
              )}

              {Object.keys(rowSelection).length > 0 && (
                <IconWarningButton
                  onClick={() => setRowSelection({})}
                  icon="minus"
                >
                  清空已選則
                </IconWarningButton>
              )}
              {storeId && (
                <SendCouponModal
                  storeId={storeId}
                  show={!isSearchActive}
                  userIds={"all"}
                />
              )}
            </LayoutGroup>
          </>
        )
      }
    >
      <div className="relative flex-1">
        <div
          className={cn(
            "absolute inset-0 bottom-2.5",
            isLoadingMembers || (isFetching && "grid place-items-center"),
          )}
        >
          {isLoadingMembers || isFetching ? (
            <Spinner />
          ) : isErrorMembers || !data?.data ? (
            <div>讀取會員資料出現錯誤</div>
          ) : (
            <div className="h-full w-full border border-line-gray bg-light-gray pt-0">
              <ScrollArea className="h-full">
                <DataTable
                  columns={columns(
                    storeId ?? "",
                    category,
                    auth.user?.permissions ?? [],
                  )}
                  data={data?.data}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  headerRowRef={headerRowRef}
                  sorting={sorting}
                  setSorting={setSorting}
                  page={page}
                  setPage={setPage}
                  totalPages={data?.meta?.pageCount}
                  isFetching={isFetching}
                  isFetched={isFetched}
                />
                <Scrollbar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
