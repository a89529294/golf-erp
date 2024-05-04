import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { MainLayout } from "@/layouts/main-layout";
import { columns } from "@/pages/store-management/data-table/columns";
import { DataTable } from "@/pages/store-management/data-table/data-table";
import { loader, storeQuery } from "@/pages/store-management/loader";
import {
  StoreCategory,
  StoreCategoryWithAllTuple,
  storeCategoriesWithAll,
} from "@/utils";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";

export function Component() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...storeQuery,
    initialData,
  });

  const category = searchParams.get("category");
  useEffect(() => {
    if (
      !storeCategoriesWithAll.includes(
        category as StoreCategoryWithAllTuple[number],
      )
    )
      setSearchParams({ category: "all" }, { replace: true });
  }, [category, setSearchParams]);

  const filteredData = (() => {
    if (category === null || category === "all")
      return Object.values(data).flatMap((v) => v);

    return data[category as StoreCategory];
  })();
  return (
    <MainLayout
      headerChildren={
        <>
          {Object.keys(rowSelection).length ? (
            <Modal
              dialogTriggerChildren={
                <IconWarningButton icon="trashCan">刪除</IconWarningButton>
              }
              onSubmit={() => {}}
              title="確定刪除選取廠商?"
            />
          ) : null}
          <IconButton icon="plus">
            <Link
              to={
                linksKV["system-management"].subLinks[
                  "personnel-system-management"
                ].paths.new
              }
            >
              新增廠商
            </Link>
          </IconButton>
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
        </>
      }
    >
      <div className="flex w-full flex-col gap-1 border border-line-gray bg-light-gray p-1">
        <DataTable
          columns={columns}
          data={filteredData}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
    </MainLayout>
  );
}
