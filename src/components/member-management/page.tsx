import { SearchInput } from "@/components/search-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";

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
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSearchActive = isSearchFocused ? true : !!globalFilter;
  const [value, setValue] = useState("");

  const {
    data: members,
    isLoading: isLoadingMembers,
    isError: isErrorMembers,
  } = useQuery({
    queryKey: [category, "members", storeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/app-users/${category}/${storeId}?populate=storeAppUsers&pageSize=999&populate=appChargeHistories.store`,
      );
      const data = await response.json();
      return data.data;
    },
    enabled: !!storeId,
    throwOnError: false,
  });

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
                // setPage(1);
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
                  // setPage(1);
                }}
                isFocused={isSearchFocused}
                setIsFocused={setIsSearchFocused}
              />

              {storeId && (
                <SendCouponModal
                  storeId={storeId}
                  show={!isSearchActive}
                  userIds={Object.keys(rowSelection)}
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
      {/* {isMobile ? (
        ({ height }) => (
          <ScrollArea style={{ height }} className="w-full">
            <div className="w-full p-1 pt-0 border border-line-gray bg-light-gray">
              {members && (
                <DataTable
                  columns={mobileColumns(
                    storeId ?? "",
                    category,
                    auth.user?.permissions ?? [],
                  )}
                  data={members}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              )}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        )
      ) : (
        <div
          className={cn(
            "w-full ",
            isLoadingMembers && "grid place-items-center",
          )}
        >
          {isLoadingMembers ? (
            <Spinner />
          ) : members ? (
            <div className="w-full pt-0 border border-t-0 border-line-gray bg-light-gray">
              <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
              <div
                className="sticky z-10 w-full border-b border-line-gray"
                style={{
                  top: `calc(90px + ${headerRowHeight}px)`,
                }}
              />
              <DataTable
                columns={columns(
                  storeId ?? "",
                  category,
                  auth.user?.permissions ?? [],
                )}
                data={members}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                headerRowRef={headerRowRef}
              />
            </div>
          ) : null}
        </div>
      )} */}
      <div className="relative flex-1">
        <div
          className={cn(
            "absolute inset-0 bottom-2.5",
            isLoadingMembers && "grid place-items-center",
          )}
        >
          {isLoadingMembers ? (
            <Spinner />
          ) : isErrorMembers || !members ? (
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
                  data={members}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  headerRowRef={headerRowRef}
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
