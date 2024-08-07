import {
  IconButton,
  TextButton,
  TextWarningButton,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useParams } from "react-router-dom";

export function SendCouponModal({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const { id } = useParams();

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
        `/coupon?populate=store&pageSize=999&filter[store.id]=${storeId}`,
      ).then((r) => r.json());
      const parsedData = couponsSchema.parse(data);
      return parsedData.data;
    },
    enabled: !!storeId,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton icon="coupon" type="button">
          發送優惠券
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <form
          id="xx"
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className={cn(
            `flex h-[610px] w-[790px] flex-col  px-14 py-5 sm:w-80`,
          )}
        >
          {/* <DialogHeader className="relative block mb-5 overflow-auto isolate px-14 sm:px-4"> */}

          <ScrollArea className="h-[500px] overflow-auto sm:h-[417px] sm:w-72">
            {coupons && (
              <DataTable
                columns={columns}
                data={coupons}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                rmTheadMarginTop
              />
            )}
            <Scrollbar orientation="horizontal" />
          </ScrollArea>

          {/* </DialogHeader> */}
          <DialogFooter className="justify-center ">
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
    </Dialog>
  );
}
