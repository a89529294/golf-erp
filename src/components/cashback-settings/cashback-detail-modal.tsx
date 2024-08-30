import { ReactElement, ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { cn } from "@/lib/utils.ts";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { TextButton, TextWarningButton } from "@/components/ui/button.tsx";
import { ChargeDiscount } from "@/pages/driving-range/cashback-settings/loader.ts";
import { Label } from "@/components/ui/label.tsx";
import { UnderscoredInput } from "@/components/underscored-input.tsx";
import { privateFetch } from "@/utils/utils.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CashbackDetailModalProps {
  isInTableRow?: boolean;
  dialogTriggerChildren:
    | ReactElement
    | (({ setOpen }: { setOpen: (arg: boolean) => void }) => ReactNode);
  mode: "new" | "edit";
  storeId: string;
  chargeDiscount?: ChargeDiscount;
  onModalClose?: () => void;
  className?: string;
}

export function CashbackDetailModal({
  isInTableRow,
  dialogTriggerChildren,
  mode,
  storeId,
  chargeDiscount,
  onModalClose,
  className,
}: CashbackDetailModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: createChargeDiscount } = useMutation({
    mutationKey: ["create-charge-discount"],
    mutationFn: async (prop: {
      title: string;
      chargeAmount: number;
      extraAmount: number;
    }) => {
      await privateFetch(`/charge-discount`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ storeId, ...prop }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("新增儲值優惠成功");
      queryClient.invalidateQueries({
        queryKey: ["charge-discount", storeId],
      });
    },
  });

  const { mutateAsync: editChargeDiscount } = useMutation({
    mutationKey: ["update-charge-discount"],
    mutationFn: async (prop: {
      title: string;
      chargeAmount: number;
      extraAmount: number;
    }) => {
      if (!chargeDiscount?.id) {
        throw new Error("ChargeDiscount Id not found");
      }

      await privateFetch(`/charge-discount/${chargeDiscount.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(prop),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("修改儲值優惠成功");
      queryClient.invalidateQueries({ queryKey: ["charge-discount", storeId] });
    },
  });

  async function onSubmit(formData: {
    title: string;
    chargeAmount: number;
    extraAmount: number;
  }) {
    console.log({ formData });
    setLoading(true);
    setDisabled(true);
    try {
      await (mode === "new"
        ? createChargeDiscount(formData)
        : editChargeDiscount(formData));
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setDisabled(false);
      setOpen(false);
    }
  }

  return (
    <div
      className={
        isInTableRow
          ? cn("hidden pr-6 text-right group-hover:block")
          : undefined
      }
    >
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          onModalClose && !open && onModalClose();
        }}
      >
        <DialogTrigger asChild>
          {typeof dialogTriggerChildren === "function"
            ? dialogTriggerChildren({ setOpen })
            : dialogTriggerChildren}
        </DialogTrigger>

        <DialogContent>
          <form
            id="xx"
            onSubmit={async (e) => {
              const formData = new FormData(e.currentTarget);
              e.preventDefault();
              await onSubmit({
                title: formData.get("title") as string,
                chargeAmount: Number(formData.get("chargeAmount")),
                extraAmount: Number(formData.get("extraAmount")),
              });
              e.stopPropagation();
            }}
            className={cn(
              `flex w-[620px] flex-col items-center pb-5 sm:w-72`,
              className,
            )}
          >
            <DialogPrimitive.DialogTitle />
            <DialogHeader className="w-full">
              <div className="flex w-full flex-col">
                <header className="bg-light-gray py-2 text-center">
                  編輯優惠券
                </header>

                <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-10">
                  <Label className="mt-10 flex items-center gap-5">
                    <h2 className="w-28">標題</h2>
                    <UnderscoredInput
                      className="w-80"
                      name={"title"}
                      disabled={false}
                      required
                      defaultValue={chargeDiscount?.title ?? ""}
                    />
                  </Label>
                  <Label className="flex items-center gap-5 ">
                    <h2 className="w-28">單筆消費滿額</h2>
                    <UnderscoredInput
                      className="w-80"
                      name={"chargeAmount"}
                      disabled={false}
                      type="number"
                      required
                      defaultValue={chargeDiscount?.chargeAmount ?? 0}
                    />
                  </Label>
                  <Label className="flex items-center gap-5 ">
                    <h2 className="w-28">贈送點數</h2>
                    <div className="flex flex-row items-baseline">
                      <UnderscoredInput
                        className="w-80"
                        name={"extraAmount"}
                        disabled={false}
                        type="number"
                        required
                        defaultValue={chargeDiscount?.extraAmount ?? 0}
                      />
                    </div>
                  </Label>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="">
              <TextButton
                type="submit"
                form="xx"
                loading={loading}
                disabled={loading}
                onClick={() => {
                  onModalClose && onModalClose();
                }}
              >
                確定
              </TextButton>
              <DialogPrimitive.Close asChild>
                <TextWarningButton disabled={disabled}>取消</TextWarningButton>
              </DialogPrimitive.Close>
            </DialogFooter>
          </form>
        </DialogContent>
        <DialogDescription />
      </Dialog>
    </div>
  );
}
