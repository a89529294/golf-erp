import {
  IconButtonBorderLess,
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
import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function UserModifyPasswordDialog({
  btnClassName,
}: {
  btnClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { mutateAsync } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: async (prop: { oldPassword: string; newPassword: string }) => {
      await privateFetch(`/auth/password`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({
          ...prop,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("變更密碼成功");
    },
    onError() {
      toast.success("舊密碼錯誤或是新密碼並未在8到20字之間");
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButtonBorderLess className={btnClassName} icon="lock">
          更新密碼
        </IconButtonBorderLess>
      </DialogTrigger>
      <DialogContent className="h-[355px] w-[621px] items-stretch sm:w-72">
        <div className="flex flex-1 flex-col">
          <DialogHeader className="flex h-10 flex-grow-0 basis-10 items-center justify-center bg-light-gray">
            <DialogTitle className="">更新密碼</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form
            id="xx"
            onSubmit={async (e) => {
              setLoading(true);
              setDisabled(true);
              e.preventDefault();
              try {
                const formData = new FormData(e.currentTarget);

                await mutateAsync({
                  oldPassword: formData.get("oldPassword") as string,
                  newPassword: formData.get("newPassword") as string,
                });
              } catch (e) {
                console.log(e);
              } finally {
                setLoading(false);
                setDisabled(false);
                setOpen(false);
              }

              e.stopPropagation();
            }}
            className="flex flex-1 flex-col items-center justify-center gap-6 pb-10"
          >
            <Label className="mt-10 flex items-center gap-5">
              <h2 className="w-16">舊密碼</h2>
              <UnderscoredInput
                className="w-80 sm:w-40"
                name={"oldPassword"}
                disabled={false}
                required
                type="password"
              />
            </Label>
            <Label className="flex items-center gap-5 ">
              <h2 className="w-16">新密碼</h2>
              <UnderscoredInput
                className="w-80 sm:w-40"
                name={"newPassword"}
                disabled={false}
                required
                type="password"
              />
            </Label>
          </form>
        </div>
        <DialogFooter className="mb-5 items-center justify-center">
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
      </DialogContent>
    </Dialog>
  );
}
