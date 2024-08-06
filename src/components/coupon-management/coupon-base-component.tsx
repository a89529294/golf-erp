import { StoreSelect } from "@/components/category/store-select";
import { SearchInput } from "@/components/search-input";
import { MainLayout } from "@/layouts/main-layout";
import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import useMediaQuery from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { DataTable } from "./data-table/data-table";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { couponsSchema } from "@/pages/driving-range/coupon-management/loader";
import { columns } from "./data-table/columns";
import { NewCouponModal } from "@/components/coupon-management/new-coupon.modal";

export function CouponBaseComponent({
  loader,
  category,
  navigateTo,
}: {
  loader: () => Promise<
    {
      id: string;
      name: string;
    }[]
  >;
  category: "ground" | "simulator" | "golf";
  navigateTo: string;
}) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/coupon?populate=store&pageSize=999&filter[store.id]=${storeId}`,
      ).then((r) => r.json());
      const parsedData = couponsSchema.parse(data);
      return parsedData.data;
    },
    enabled: !!storeId,
  });

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
          <NewCouponModal />
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
                  columns={columns}
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
            isLoading && "grid place-items-center",
          )}
        >
          {isLoading ? (
            <Spinner />
          ) : coupons ? (
            <DataTable
              columns={columns}
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
