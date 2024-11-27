import {
  IconButton,
  TextButton,
  TextWarningButton,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UnderscoredInput } from "@/components/underscored-input";
// import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CreateCouponThenSendModal({
  show,
  userIds,
  resetUserIds,
  onClose,
}: {
  show: boolean;
  userIds?: string[];
  resetUserIds?: () => void;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { mutateAsync } = useMutation({
    mutationKey: ["send-coupon"],
    mutationFn: async (prop: {
      name: string;
      expiration: number;
      amount: number;
      number: string;
    }) => {
      // TODO: this api is not yet implemented
      // await privateFetch(`/coupon/send-all`, {
      //   method: "POST",
      //   credentials: "include",
      //   body: JSON.stringify(prop),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      return new Promise((r) => setTimeout(r, 3000));
    },
    onSuccess() {
      toast.success("贈送優惠券成功");
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v && onClose) onClose();
      }}
    >
      <AnimatePresence mode="popLayout">
        {show && (
          <motion.div
            className="overflow-hidden"
            animate={{ width: "auto", originX: "right" }}
            exit={{ width: 0, originX: "right" }}
          >
            <DialogTrigger asChild disabled={userIds && userIds.length === 0}>
              <IconButton
                icon="send"
                className={cn(
                  "",
                  !show && "px-0",
                  "border border-line-gray outline-none hover:border-[1.5px] hover:border-orange",
                )}
                // style={{ width: show ? "auto" : 0 }}
              >
                {userIds ? "贈送優惠券" : "全體贈送優惠券"}
              </IconButton>
            </DialogTrigger>
          </motion.div>
        )}
      </AnimatePresence>

      <DialogContent>
        <form
          id="xx"
          ref={formRef}
          // onSubmit={async (e) => {
          //   const form = e.currentTarget;
          //   if (!form.checkValidity()) return;

          //   setLoading(true);
          //   setDisabled(true);
          //   e.preventDefault();
          //   e.stopPropagation();
          //   setConfirmationOpen(true);
          //   setFormData(new FormData(e.currentTarget));
          // }}
          className="flex w-[620px] flex-col items-center pb-5 sm:w-72"
        >
          <DialogPrimitive.DialogTitle />
          <DialogHeader className="w-full">
            <div className="flex w-full flex-col">
              <header className="bg-light-gray py-2 text-center">
                贈送優惠券
              </header>

              <div className="flex flex-1 items-center justify-center pb-10 ">
                <div className="flex w-[400px] flex-col gap-6 sm:w-72 sm:gap-3 sm:px-2">
                  <Label className="mt-10 flex items-center gap-5">
                    <h2 className="w-20 shrink-0">標題</h2>
                    <UnderscoredInput
                      className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                      name={"name"}
                      disabled={false}
                      required
                    />
                  </Label>
                  <Label className="flex items-center gap-5 ">
                    <h2 className="w-20 shrink-0">編號</h2>
                    <UnderscoredInput
                      className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                      name={"number"}
                      disabled={false}
                      required
                    />
                  </Label>
                  <Label className="flex items-center gap-5 ">
                    <h2 className="w-20 shrink-0">使用期限</h2>
                    <div className="flex flex-1 flex-row items-baseline sm:w-auto sm:min-w-0 sm:flex-1">
                      <UnderscoredInput
                        className="w-full"
                        name={"expiration"}
                        disabled={false}
                        type="number"
                        required
                      />
                      天
                    </div>
                  </Label>
                  <Label className="flex items-center gap-5 ">
                    <h2 className="w-20 shrink-0">金額</h2>
                    <UnderscoredInput
                      className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                      name={"amount"}
                      disabled={false}
                      type="number"
                      required
                    />
                  </Label>
                </div>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="">
            <ConfirmationModal
              onClick={(e) => {
                if (!formRef.current || !formRef.current.checkValidity()) {
                  e.preventDefault();
                  formRef.current?.reportValidity();
                  return;
                }

                setConfirmationOpen(true);
              }}
              onSubmit={async () => {
                if (!formRef.current) return;
                const formData = new FormData(formRef.current);

                setLoading(true);
                await mutateAsync({
                  name: formData.get("name") as string,
                  expiration: +formData.get("expiration")!,
                  amount: +formData.get("amount")!,
                  number: formData.get("number") as string,
                });
                setLoading(false);
                setOpen(false);
                onClose && onClose();
                setConfirmationOpen(false);
              }}
              open={confirmationOpen}
              setOpen={setConfirmationOpen}
              loading={loading}
            />
            <DialogPrimitive.Close asChild>
              <TextWarningButton disabled={loading}>取消</TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
      <DialogDescription className="hidden" />
    </Dialog>
  );
}

function ConfirmationModal({
  onClick,
  onSubmit,
  open,
  setOpen,
  loading,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  onSubmit: () => Promise<void>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div layout>
          <TextButton type="button" onClick={onClick}>
            確定
          </TextButton>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="px-4 py-2">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription className="text-base text-black">
            請問是否確認無誤？
          </DialogDescription>
        </DialogHeader>
        <form
          id="confirmation-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
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
