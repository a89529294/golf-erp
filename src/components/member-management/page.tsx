import { SearchInput } from "@/components/search-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import useMediaQuery from "@/hooks/use-media-query";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";

import { privateFetch } from "@/utils/utils";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { columns, mobileColumns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";
import { StoreSelect } from "@/components/category/store-select";

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
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: [category, "members", storeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/app-users/${category}/${storeId}?populate=storeAppUsers&pageSize=999`,
      );
      const data = await response.json();
      return data.data;
    },
    enabled: !!storeId,
  });

  return (
    <MainLayout
      headerChildren={
        <>
          {/* <Link
            className={button()}
            to={linksKV["member-management"].paths["new"]}
          >
            <img src={plusIcon} />
            新增會員
          </Link> */}

          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateMap[category]}
          />
          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {isMobile ? (
        ({ height }) => (
          <ScrollArea style={{ height }}>
            <div className="w-full border border-line-gray bg-light-gray p-1 pt-0">
              {members && (
                <DataTable
                  columns={mobileColumns(storeId ?? "", category)}
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
            "w-full border border-line-gray bg-light-gray p-1 pt-0",
            isLoadingMembers && "grid place-items-center",
          )}
        >
          {isLoadingMembers ? (
            <Spinner />
          ) : members ? (
            <DataTable
              columns={columns(storeId ?? "", category)}
              data={members}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          ) : null}
        </div>
      )}
    </MainLayout>
  );
}
