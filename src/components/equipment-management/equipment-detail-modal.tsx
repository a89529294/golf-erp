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
import { Label } from "@/components/ui/label.tsx";
import { UnderscoredInput } from "@/components/underscored-input.tsx";
import { privateFetch } from "@/utils/utils.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Equipment } from "@/pages/equipment-management/loader.ts";

interface EquipmentDetailModalProps {
  isInTableRow?: boolean;
  dialogTriggerChildren:
    | ReactElement
    | (({ setOpen }: { setOpen: (arg: boolean) => void }) => ReactNode);
  mode: "new" | "edit";
  equipment?: Equipment;
  onModalClose?: () => void;
  className?: string;
}

export function EquipmentDetailModal({
  isInTableRow,
  dialogTriggerChildren,
  mode,
  equipment,
  onModalClose,
  className,
}: EquipmentDetailModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const queryClient = useQueryClient();

  const { mutateAsync: createChargeDiscount } = useMutation({
    mutationKey: ["create-equipments"],
    mutationFn: async (prop: { title: string }) => {
      await privateFetch(`/equipment`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(prop),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("新增標籤成功");
      return queryClient.invalidateQueries({
        queryKey: ["equipments"],
      });
    },
  });

  const { mutateAsync: editChargeDiscount } = useMutation({
    mutationKey: ["update-equipments"],
    mutationFn: async (prop: { title: string }) => {
      if (!equipment?.id) {
        throw new Error("Equipment Id not found");
      }

      await privateFetch(`/equipment/${equipment.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(prop),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("修改標籤成功");
      return queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });

  async function onSubmit(formData: { title: string }) {
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
                  {mode === "new" ? "新增" : "編輯"}標籤
                </header>

                <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-10">
                  <Label className="mt-10 flex items-center gap-5">
                    <h2 className="w-28">名稱</h2>
                    <UnderscoredInput
                      className="w-80"
                      name={"title"}
                      disabled={false}
                      required
                      defaultValue={equipment?.title ?? ""}
                    />
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
