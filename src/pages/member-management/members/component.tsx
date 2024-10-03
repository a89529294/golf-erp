import plusIcon from "@/assets/plus-icon.svg";
import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useDebouncedValue } from "@/hooks/use-debounced-value.ts";
import useMediaQuery from "@/hooks/use-media-query.ts";
import { useWindowSizeChange } from "@/hooks/use-window-size-change.ts";
import { MainLayout } from "@/layouts/main-layout";
import {
  genMembersQuery,
  loader,
} from "@/pages/member-management/members/loader";
import { linksKV } from "@/utils/links";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { genColumns, mobileColumns } from "./data-table/columns.tsx";
import { DataTable } from "./data-table/data-table.tsx";

export function Component() {
  const { user } = useAuth();
  const headerRowRef = useRef<HTMLTableRowElement>(null);
  const [headerRowHeight, setHeaderRowHeight] = useState(48);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebouncedValue(globalFilter, 500);
  const [page, setPage] = useState(1);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  // const { data } = useMembers(page, initialData);
  const { data, isFetching } = useQuery({
    ...genMembersQuery(page),
    initialData,
  });
  console.log(isFetching);

  useWindowSizeChange(() => {
    if (headerRowRef.current)
      setHeaderRowHeight(headerRowRef.current.clientHeight);
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={button()}
            to={linksKV["member-management"].subLinks["members"].paths["new"]}
          >
            <img src={plusIcon} />
            新增會員
          </Link>

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
              {data && (
                <DataTable
                  columns={mobileColumns}
                  data={data.data}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={debouncedGlobalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              )}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        )
      ) : (
        <div className="relative mb-10 w-full border border-t-0 border-line-gray bg-light-gray pt-0">
          <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
          <div
            className="sticky z-10 w-full border-b border-line-gray"
            style={{
              top: `calc(90px + ${headerRowHeight}px)`,
              // top: `calc(188px)`,
            }}
          />
          {data && (
            <DataTable
              columns={genColumns(user!.permissions)}
              data={data.data}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={debouncedGlobalFilter}
              setGlobalFilter={setGlobalFilter}
              headerRowRef={headerRowRef}
              page={page}
              setPage={setPage}
              totalPages={data.meta.pageCount}
              isFetching={isFetching}
            />
          )}
        </div>
      )}
    </MainLayout>
  );
}
