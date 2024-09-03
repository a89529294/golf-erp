import { loader } from ".";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/main-layout.tsx";
import { StoreSelect } from "@/components/category/store-select.tsx";
import useMediaQuery from "@/hooks/use-media-query.ts";
import { SearchInput } from "@/components/search-input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { privateFetch } from "@/utils/utils.ts";
import { chargeDiscountsSchema } from "@/pages/driving-range/cashback-settings/loader.ts";
import { genColumns } from "@/components/cashback-settings/data-table/columns";
import { IconButton } from "@/components/ui/button.tsx";
import { CashbackDetailModal } from "@/components/cashback-settings/cashback-detail-modal.tsx";
import { DataTable } from "@/components/cashback-settings/data-table/data-table.tsx";
import { toast } from "sonner";

const category = "ground";
const navigateTo = "/driving-range/cashback-settings";

export function Component() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");
  if (!storeId) {
    navigate("/", { replace: true });
  }

  const isMobile = useMediaQuery("(max-width: 639px)");
  const headerRowHeight = 48;

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const queryClient = useQueryClient();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: chargeDiscounts, isLoading } = useQuery({
    queryKey: ["charge-discount", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/charge-discount/ground?storeId=${storeId}`,
      ).then((r) => r.json());
      return chargeDiscountsSchema.parse(data);
    },
    enabled: !!storeId,
  });

  const { mutateAsync: deleteChargeDiscount } = useMutation({
    mutationKey: ["delete-charge-discount"],
    mutationFn: async (id: string) => {
      if (!id) {
        throw new Error("ChargeDiscount Id not found");
      }

      await privateFetch(`/charge-discount/ground/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("刪除儲值優惠成功");
      return queryClient.invalidateQueries({
        queryKey: ["charge-discount", storeId],
      });
    },
  });

  const columns = useMemo(
    () => genColumns(category, storeId!, deleteChargeDiscount),
    [storeId, deleteChargeDiscount],
  );

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
          <CashbackDetailModal
            category={category}
            dialogTriggerChildren={
              <IconButton icon="plus">新增儲值優惠</IconButton>
            }
            mode="new"
            storeId={storeId!}
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
            <div className="w-full border border-line-gray bg-light-gray p-1 pt-0">
              {chargeDiscounts && (
                <DataTable
                  columns={columns}
                  data={chargeDiscounts}
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
        <div className={cn("w-full ", isLoading && "grid place-items-center")}>
          {isLoading ? (
            <Spinner />
          ) : chargeDiscounts ? (
            <div className="w-full border border-t-0 border-line-gray bg-light-gray pt-0">
              <div className="sticky top-[90px] z-10 w-full border-b border-line-gray" />
              <div
                className="sticky z-10 w-full border-b border-line-gray"
                style={{
                  top: `calc(90px + ${headerRowHeight}px)`,
                }}
              />
              <DataTable
                columns={columns}
                data={chargeDiscounts}
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
