import { StoreSelect } from "@/components/category/store-select";
import { SearchInput } from "@/components/search-input";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { loader } from ".";
import useMediaQuery from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { DataTable } from "./data-table/data-table";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

export function Component() {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  console.log(storeId);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const coupons = [
    {
      valid: true,
      title: "優惠1",
      expiration: 30,
      amount: 100,
    },
  ];
  const isLoadingCoupons = false;
  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category={"ground"}
            initialData={initialData}
            navigateTo="/driving-range/coupon-management"
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
          <ScrollArea style={{ height }} className="w-full">
            <div className="w-full p-1 pt-0 border border-line-gray bg-light-gray">
              {coupons && (
                <DataTable
                  columns={[]}
                  data={coupons}
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
            isLoadingCoupons && "grid place-items-center",
          )}
        >
          {isLoadingCoupons ? (
            <Spinner />
          ) : coupons ? (
            <DataTable
              columns={[]}
              data={coupons}
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
