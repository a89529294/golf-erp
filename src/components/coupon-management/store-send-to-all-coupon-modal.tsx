import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import sendIcon from "@/assets/send-icon.svg";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function StoreSendToAllCouponModal({
  storeName,
  couponName,
}: {
  storeName: string;
  couponName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { mutate } = useMutation({
    mutationKey: ["send-store-coupon-to-all"],
    mutationFn: async () => {
      setLoading(true);

      await new Promise((r) => setTimeout(r, 2000));
      setLoading(false);
      setOpen(false);
    },
    onSuccess() {
      toast.success("成功送出優惠券");
    },
    onError() {
      toast.error("無法送出優惠券");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hidden group-hover:block">
          <img src={sendIcon} className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="px-4 py-2">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription className="text-base text-black">
            請問是否將 {couponName} 送給 {storeName} 的會員?
          </DialogDescription>
        </DialogHeader>
        <form
          id="confirmation-form"
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
        />
        <DialogFooter className="mt-4">
          <TextButton
            loading={loading}
            disabled={loading}
            type="submit"
            form="confirmation-form"
          >
            確定
          </TextButton>
          <DialogPrimitive.Close asChild>
            <TextWarningButton disabled={loading}>取消</TextWarningButton>
          </DialogPrimitive.Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
