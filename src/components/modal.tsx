import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactElement, ReactNode, useState } from "react";

export function Modal({
  dialogTriggerChildren,
  children,
  onSubmit,
}: {
  dialogTriggerChildren: ReactElement;
  children: ReactNode;
  onSubmit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>

      <DialogContent>
        <form
          id="xx"
          onSubmit={async (e) => {
            setLoading(true);
            setDisabled(true);
            e.preventDefault();
            await onSubmit();
            setLoading(false);
            setDisabled(false);
            setOpen(false);
          }}
          className="flex h-[190px] w-[400px] flex-col items-center pb-5"
        >
          <DialogHeader>
            <DialogTitle>{children}</DialogTitle>
          </DialogHeader>
          <DialogFooter className="">
            <TextButton
              type="submit"
              form="xx"
              loading={loading}
              disabled={loading}
            >
              確定
            </TextButton>
            <DialogPrimitive.Close asChild>
              <TextWarningButton disabled={disabled}>取消</TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
