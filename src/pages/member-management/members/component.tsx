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
import { genColumns } from "./data-table/columns.tsx";
// import { DataTable } from "./data-table/data-table.tsx";
import { DataTable } from "@/pages/member-management/members/data-table/data-table.tsx";
import { SortingState } from "@tanstack/react-table";
import { CreateCouponThenSendModal } from "@/components/coupon-management/create-coupon-then-send-modal.tsx";
import { LayoutGroup } from "framer-motion";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { IconWarningButton } from "@/components/ui/button.tsx";

export function Component() {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const headerRowRef = useRef<HTMLTableRowElement>(null);
  const [headerRowHeight, setHeaderRowHeight] = useState(48);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const debouncedGlobalFilter = useDebouncedValue(globalFilter, 500);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSearchActive = isSearchFocused ? true : !!globalFilter;
  const [page, setPage] = useState(1);
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data, isFetching, isFetched } = useQuery({
    ...genMembersQuery(page, {
      sort: sorting[0].id,
      order: sorting[0].desc ? "DESC" : "ASC",
      filter: debouncedGlobalFilter,
    }),
    initialData,
  });

  useWindowSizeChange(() => {
    if (headerRowRef.current)
      setHeaderRowHeight(headerRowRef.current.clientHeight);
  });

  // console.log(user?.permissions);

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
                  <MenubarItem>
                    <Link
                      className={button()}
                      to={
                        linksKV["member-management"].subLinks["members"].paths[
                          "new"
                        ]
                      }
                    >
                      <img src={plusIcon} />
                      新增會員
                    </Link>
                  </MenubarItem>
                  <MenubarItem onClick={(e) => e.preventDefault()}>
                    <CreateCouponThenSendModal
                      show={true}
                      userIds={Object.keys(rowSelection)}
                      onClose={() => setValue("")}
                    />
                  </MenubarItem>
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
                  <MenubarItem onClick={(e) => e.preventDefault()}>
                    <CreateCouponThenSendModal
                      show={true}
                      onClose={() => setValue("")}
                    />
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <SearchInput
              // className="sm:hidden"
              value={globalFilter}
              setValue={(v) => {
                setGlobalFilter(v);
                setPage(1);
              }}
            />
          </div>
        ) : (
          <>
            <div>
              <Link
                className={button()}
                to={
                  linksKV["member-management"].subLinks["members"].paths["new"]
                }
              >
                <img src={plusIcon} />
                新增會員
              </Link>
            </div>
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

              <CreateCouponThenSendModal
                show={!isSearchActive}
                userIds={Object.keys(rowSelection)}
              />
              {Object.keys(rowSelection).length > 0 && (
                <IconWarningButton
                  onClick={() => setRowSelection({})}
                  icon="minus"
                >
                  清空已選則
                </IconWarningButton>
              )}
              <CreateCouponThenSendModal show={!isSearchActive} />
            </LayoutGroup>
          </>
        )
      }
    >
      {isMobile ? (
        ({ height }) => (
          <ScrollArea style={{ height, width: "100%" }}>
            <div className="w-full border border-line-gray bg-light-gray p-1 pt-0">
              {data && (
                <DataTable
                  columns={genColumns(user!.permissions, () => setPage(1))}
                  data={data.data}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={debouncedGlobalFilter}
                  setGlobalFilter={setGlobalFilter}
                  sorting={sorting}
                  setSorting={setSorting}
                  page={page}
                  setPage={setPage}
                  totalPages={data.meta.pageCount}
                  isFetching={isFetching}
                  isFetched={isFetched}
                  enableMultiRowSelection
                />
              )}
            </div>
            <Scrollbar orientation="horizontal" />
          </ScrollArea>
        )
      ) : (
        <div className="relative mb-[100px] w-full border border-t-0 border-line-gray bg-light-gray pt-0">
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
              columns={genColumns(user!.permissions, () => setPage(1))}
              data={data.data}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={debouncedGlobalFilter}
              setGlobalFilter={setGlobalFilter}
              sorting={sorting}
              setSorting={setSorting}
              headerRowRef={headerRowRef}
              page={page}
              setPage={setPage}
              totalPages={data.meta.pageCount}
              isFetching={isFetching}
              isFetched={isFetched}
              enableMultiRowSelection
            />
          )}
        </div>
      )}
    </MainLayout>
  );
}
