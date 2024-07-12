import plusIcon from "@/assets/plus-icon.svg";
import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import {
  columns,
  mobileColumns,
} from "@/pages/store-management/data-table/columns";
import { DataTable } from "@/pages/store-management/data-table/data-table";
import { loader, storesQuery } from "@/pages/store-management/loader";
import { StoreCategory, storeCategoryWithAllMap } from "@/utils";
import { linksKV } from "@/utils/links";
import { privateFetch } from "@/utils/utils";
import { SelectTrigger } from "@radix-ui/react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { toast } from "sonner";

export function Component() {
  const [category, setCategory] = useState("all");
  const isMobile = useIsMobile();
  const [nav, setNav] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...storesQuery,
    initialData,
  });
  const { mutateAsync: deleteStore, isPending } = useMutation({
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
      setRowSelection({});
    },
    onError: () => toast.error("刪除廠商失敗"),
  });

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
          ) : (
            <Link
              className={button()}
              to={linksKV["store-management"].paths["new"]}
            >
              <img src={plusIcon} />
              新增廠商
            </Link>
          )}

          <SearchInput
            className="sm:hidden"
            disabled={isPending}
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {({ height }) => {
        return (
          <div className="flex flex-col w-full p-1 border border-line-gray bg-light-gray">
            <nav
              ref={(e) => {
                setNav(e);
              }}
            >
              <ul className="flex items-center gap-3 py-2 pl-5 isolate sm:hidden">
                {Object.entries(storeCategoryWithAllMap).map(([key, value]) => (
                  <li key={key}>
                    <button
                      onClick={() => setCategory(key)}
                      className={cn(
                        "relative grid h-9 place-items-center rounded-full border border-line-gray bg-white px-5",
                      )}
                    >
                      {category === key && (
                        <motion.div
                          className="absolute inset-0 z-10 bg-black rounded-full"
                          layoutId="category-tab"
                          transition={{
                            duration: 0.3,
                          }}
                        />
                      )}
                      <div
                        className={cn(
                          "relative z-20 transition-colors duration-300",
                          category === key && "text-white",
                        )}
                      >
                        {value}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="hidden pb-1 sm:block">
                <Select
                  // open={mobileCategorySelectOpen}
                  // onOpenChange={setMobileCategorySelectOpen}
                  value={category ?? ""}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="grid px-5 text-white border rounded-full h-9 place-items-center border-line-gray bg-secondary-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(storeCategoryWithAllMap).map(
                      ([key, value]) => {
                        return <SelectItem value={key}>{value}</SelectItem>;
                      },
                    )}
                  </SelectContent>
                </Select>
              </div>
            </nav>

            {isMobile ? (
              <ScrollArea
                className=""
                style={{
                  height: nav ? height - nav?.clientHeight : 0,
                }}
              >
                <DataTable
                  columns={mobileColumns}
                  data={[...filteredData, ...filteredData]}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            )}
          </div>
        );
      }}
    </MainLayout>
  );
}
