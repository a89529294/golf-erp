import {
  IconButton,
  TextButton,
  TextWarningButton,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { columns } from "./columns";
import { DataTable } from "@/components/coupon-management/data-table/data-table";
import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { couponsSchema } from "@/pages/driving-range/coupon-management/loader";
import { useLoaderData, useParams } from "react-router-dom";
import {
  genStoreQuery,
  loader,
} from "@/pages/store-management/details/loader.ts";
import couponIcon from "@/assets/coupon.svg";

export function SendCouponModal({
  storeId,
  asMenuItem,
  closeMenu,
}: {
  storeId: string;
  asMenuItem?: boolean;
  closeMenu?: () => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const { id } = useParams();

  const initialData = useLoaderData() as Exclude<
    Awaited<ReturnType<typeof loader>>,
    Response | undefined
  >;

  if (!storeId) {
    throw new Error(`Invalid storeId: '${storeId}'`);
  }

  const { data: store } = useQuery({
    ...genStoreQuery(storeId),
    initialData: initialData[2],
  });

  const category = store?.category;

  const { mutate, isPending } = useMutation({
    mutationKey: ["add-permission-to-user"],
    mutationFn: async () => {
      await privateFetch(`/app-users/give-coupon`, {
        method: "POST",
        body: JSON.stringify({
          appUserId: id,
          couponId: Object.keys(rowSelection)[0],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      setOpen(false);
      toast.success("贈送優惠券成功");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const { data: coupons } = useQuery({
    queryKey: ["coupons", storeId],
    queryFn: async () => {
      // filter by storeId
      const data = await privateFetch(
        `/coupon/${category}?populate=store&pageSize=999&filter[store.id]=${storeId}`,
      ).then((r) => r.json());
      const parsedData = couponsSchema.parse(data);
      return parsedData.data;
    },
    enabled: Boolean(storeId && category),
  });
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(s) => {
        setOpen(s);

        if (!s) {
          setRowSelection({});
          closeMenu && closeMenu();
        }
      }}
    >
      <DialogTrigger>
        {asMenuItem ? (
          <div className="flex gap-1">
            <img src={couponIcon} />
            發送優惠券
          </div>
        ) : (
          <IconButton icon="coupon" type="button">
            發送優惠券
          </IconButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          id="xx"
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className={cn(
            `flex h-[610px] w-[790px] flex-col px-14 py-5 sm:h-[500px] sm:w-80 sm:p-4`,
          )}
        >
          {/* <DialogHeader className="relative block mb-5 overflow-auto isolate px-14 sm:px-4"> */}

          <ScrollArea className="h-[500px] overflow-auto border border-line-gray  sm:h-[417px] sm:w-72">
            {coupons && (
              <div className=" before:fixed before:h-12 before:w-1 before:bg-light-gray">
                <div className="fixed right-[57px] h-12 w-1 bg-light-gray" />
                <div className="sticky top-12 z-10 w-full border-b border-line-gray" />
                <DataTable
                  columns={columns}
                  data={Array(1).fill(coupons).flat()}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  rmTheadMarginTop
                />
              </div>
            )}
            <Scrollbar orientation="horizontal" />
          </ScrollArea>

          {/* </DialogHeader> */}
          <DialogFooter className="mt-6 justify-center">
            <TextButton
              type="submit"
              form="xx"
              loading={isPending}
              disabled={isPending || Object.keys(rowSelection).length === 0}
            >
              確定
            </TextButton>
            <DialogPrimitive.Close asChild>
              <TextWarningButton disabled={isPending}>取消</TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
      <DialogTitle />
    </Dialog>
  );
}
