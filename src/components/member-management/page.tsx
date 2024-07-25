import { SearchInput } from "@/components/search-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth.tsx";
import useMediaQuery from "@/hooks/use-media-query";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";

import { getStoresQuery } from "@/pages/indoor-simulator/member-management/loader.ts";
import { privateFetch } from "@/utils/utils";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { columns, mobileColumns } from "./data-table/columns";
import { DataTable } from "./data-table/data-table";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...getStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores[category],
      category,
    ),
    initialData,
  });
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

  const onStoreValueChange = useCallback(
    (storeId: string, replace: boolean) => {
      if (category === "ground")
        navigate(`/driving-range/member-management?storeId=${storeId}`, {
          replace,
        });
      else if (category === "golf")
        navigate(`/golf/member-management?storeId=${storeId}`, { replace });
      else if (category === "simulator")
        navigate(`/indoor-simulator/member-management?storeId=${storeId}`, {
          replace,
        });
    },
    [navigate, category],
  );

  useEffect(() => {
    if (storeId) return;

    if (stores[0]) {
      onStoreValueChange(stores[0].id, true);
    }
  }, [stores, onStoreValueChange, storeId]);

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
          <Select
            value={storeId ?? ""}
            onValueChange={(v) => onStoreValueChange(v, false)}
          >
            <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark">
              <SelectValue placeholder="選擇廠商" />
            </SelectTrigger>
            <SelectContent className="w-[280px]">
              {stores.length === 0 ? (
                <SelectItem key={0} value="undef" disabled>
                  請先新增
                  {category === "golf"
                    ? "高爾夫廠商"
                    : category === "ground"
                      ? "練習場廠商"
                      : "模擬器廠商"}
                </SelectItem>
              ) : (
                stores.map((g) => {
                  return (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>

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
