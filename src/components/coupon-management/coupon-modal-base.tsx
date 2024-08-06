import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactElement, ReactNode, useState } from "react";

export function CouponModalBase({
  dialogTriggerChildren,
  children,
  onSubmit,
  onModalClose,
  onClickSubmit,
  className,
}: {
  dialogTriggerChildren:
    | ReactElement
    | (({ setOpen }: { setOpen: (arg: boolean) => void }) => ReactNode);
  children?: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  title?: string;
  onModalClose?: () => void;
  onClickSubmit?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
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
            setLoading(true);
            setDisabled(true);
            e.preventDefault();
            try {
              await onSubmit(e);
            } catch (e) {
              console.log(e);
            } finally {
              setLoading(false);
              setDisabled(false);
              setOpen(false);
            }

            e.stopPropagation();
          }}
          className={cn(
            `flex w-[620px] flex-col items-center pb-5 sm:w-72`,
            className,
          )}
        >
          <DialogPrimitive.DialogTitle />
          <DialogHeader className="w-full">{children}</DialogHeader>
          <DialogFooter className="">
            <TextButton
              type="submit"
              form="xx"
              loading={loading}
              disabled={loading}
              onClick={() => {
                onModalClose && onModalClose();
                onClickSubmit && onClickSubmit();
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
  );
}
