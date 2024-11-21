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
import { genColumns } from "./data-table/columns";
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
  const [storeName, setStoreName] = useState("");

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/coupon/${category}?populate=store&pageSize=999&filter[store.id]=${storeId}`,
      ).then((r) => r.json());
      const parsedData = couponsSchema.parse(data);
      return parsedData.data;
    },
    enabled: !!storeId,
  });
  const headerRowHeight = 48;

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
            setStoreName={setStoreName}
          />
          <NewCouponModal category={category} />
          <SearchInput
            className="sm:hidden"
            value={globalFilter}
            setValue={setGlobalFilter}
          />
        </>
      }
    >
      {isMobile ? (
        <div className="absolute inset-0 bottom-2.5">
          <ScrollArea className="h-full w-full border border-line-gray">
            <div className="w-full bg-light-gray p-1 pt-0">
              {coupons && (
                <DataTable
                  columns={genColumns(category, storeName, storeId ?? "")}
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
        </div>
      ) : (
        <div className={cn("w-full ", isLoading && "grid place-items-center")}>
          {isLoading ? (
            <Spinner />
          ) : coupons ? (
            <div className="w-full border border-t-0 border-line-gray bg-light-gray pt-0">
              <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
              <div
                className="sticky z-10 w-full border-b border-line-gray"
                style={{
                  top: `calc(90px + ${headerRowHeight}px)`,
                }}
              />
              <DataTable
                columns={genColumns(category, storeName, storeId ?? "")}
                data={coupons}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </div>
          ) : null}
        </div>
      )}
    </MainLayout>
  );
}
