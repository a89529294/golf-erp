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
        <>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateMap[category]}
          />
          <SearchInput
            // className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
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
