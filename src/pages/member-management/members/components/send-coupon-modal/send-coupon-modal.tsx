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
import { useRef, useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";

export function SendCouponModal({
  storeId,
  asMenuItem,
  closeMenu,
  show,
  userIds,
  onClose,
  resetUserIds,
}: {
  storeId: string;
  asMenuItem?: boolean;
  closeMenu?: () => void;
  show: boolean;
  userIds?: "all" | string[];
  onClose?: () => void;
  resetUserIds?: () => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const formRef = useRef<HTMLFormElement>(null);
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
    mutationKey: ["give-coupon-to-users"],
    mutationFn: async () => {
      // TODO: api not implemented yet
      if (userIds === "all") {
        // send coupon to all users
        await privateFetch(`/app-users/give-coupon-all`, {
          method: "POST",
          body: JSON.stringify({
            couponId: Object.keys(rowSelection)[0],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (Array.isArray(userIds) && userIds.length > 0) {
        // send coupon to selected users

        await privateFetch(`/app-users/give-coupon`, {
          method: "POST",
          body: JSON.stringify({
            appUserIds: userIds,
            couponId: Object.keys(rowSelection)[0],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        await privateFetch(`/app-users/give-coupon`, {
          method: "POST",
          body: JSON.stringify({
            appUserIds: [id],
            couponId: Object.keys(rowSelection)[0],
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      setOpen(false);
      onClose && onClose();
      resetUserIds && resetUserIds();
      toast.success("贈送優惠券成功");
    },
    onError: (e) => {
      console.log(e);
      toast.error("贈送優惠券失敗");
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

  console.log(userIds);
  console.log(Array.isArray(userIds));
  console.log(userIds?.length);

  return (
    <Dialog
      open={open}
      onOpenChange={(s) => {
        console.log(s);
        setOpen(s);

        if (onClose && !s) onClose();

        if (!s) {
          setRowSelection({});
          closeMenu && closeMenu();
        }
      }}
    >
      <DialogTrigger
        // disabled={Array.isArray(userIds) && userIds.length === 0}
        // disabled
        asChild
      >
        <div>
          <AnimatePresence mode="popLayout">
            {show ? (
              asMenuItem ? (
                <button className="flex gap-1">
                  <img src={couponIcon} />
                  {userIds === "all" ? "全體發送優惠券" : "發送優惠券"}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 } }}
                  exit={{ opacity: 0 }}
                >
                  <IconButton
                    disabled={Array.isArray(userIds) && userIds.length === 0}
                    icon="coupon"
                    type="button"
                  >
                    {userIds === "all" ? "全體發送優惠券" : "發送優惠券"}
                  </IconButton>
                </motion.div>
              )
            ) : null}
          </AnimatePresence>
        </div>
      </DialogTrigger>
      <DialogContent>
        <form
          ref={formRef}
          id="xx"
          onSubmit={(e) => {
            console.log("Form submitted");
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
              type="button"
              loading={isPending}
              onClick={() => formRef.current?.requestSubmit()}
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
      <DialogTitle className="hidden" />
    </Dialog>
  );
}
