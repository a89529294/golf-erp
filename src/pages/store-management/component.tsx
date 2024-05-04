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
  storeCategoryWithAllMap,
} from "@/utils";
import { linksKV } from "@/utils/links";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
            <Link to={linksKV["store-management"].paths["new"]}>新增廠商</Link>
          </IconButton>
          <SearchInput value={globalFilter} setValue={setGlobalFilter} />
        </>
      }
    >
      <div className="flex w-full flex-col border border-line-gray bg-light-gray p-1">
        <nav>
          <ul className="flex items-center gap-3 py-2 pl-5">
            {Object.entries(storeCategoryWithAllMap).map(([key, value]) => (
              <li key={key}>
                <Link
                  to={`?category=${key}`}
                  className="relative grid h-9 place-items-center rounded-full border border-line-gray bg-white px-5"
                >
                  {category === key && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black"
                      layoutId="category-tab"
                    />
                  )}
                  <div
                    className={cn("relative", category === key && "text-white")}
                  >
                    {value}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

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
