import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import plusIcon from "@/assets/plus-icon.svg";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { columns } from "@/pages/store-management/data-table/columns";
import { DataTable } from "@/pages/store-management/data-table/data-table";
import { loader, storesQuery } from "@/pages/store-management/loader";
import {
  StoreCategory,
  StoreCategoryWithAllTuple,
  storeCategoriesWithAll,
  storeCategoryWithAllMap,
} from "@/utils";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...storesQuery,
    initialData,
  });
  const { mutate: deleteStore, isPending } = useMutation({
    mutationKey: ["delete-stores"],
    mutationFn: async () => {
      await Promise.all(
        Object.keys(rowSelection).map((id) =>
          privateFetch(`/store/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stores"],
      });
      toast.success("刪除廠商成功");
    },
    onError: () => toast.error("刪除廠商失敗"),
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
                <IconWarningButton disabled={isPending} icon="trashCan">
                  刪除
                </IconWarningButton>
              }
              onSubmit={deleteStore}
              title="確定刪除選取廠商?"
            />
          ) : null}

          <Link
            className={button()}
            to={linksKV["store-management"].paths["new"]}
          >
            <img src={plusIcon} />
            新增廠商
          </Link>

          <SearchInput
            disabled={isPending}
            value={globalFilter}
            setValue={setGlobalFilter}
          />
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
