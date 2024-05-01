import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ModalDataTable } from "@/pages/system-management/system-operation-management/new-user-modal/data-table";
import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import { columns as userColumns } from "./columns";
import { toast } from "sonner";
import { AppPermissionUser } from "@/pages/system-management/app-permission-management/loader";

// const newERPUserReturnSchema = z.object({
//   user: userSchema,
//   password: z.string(),
// });

export function AddPermissionModal({
  dialogTriggerChildren,
  allUsers,
  featureId,
}: {
  dialogTriggerChildren: ReactElement;
  allUsers: AppPermissionUser[];
  featureId: string;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-permission-to-user"],
    mutationFn: async () => {
      await privateFetch(`/erp-features/${featureId}/add-permission`, {
        method: "POST",
        body: JSON.stringify({
          employeeIds: Object.keys(rowSelection),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["erp-features-with-users"],
      });

      setOpen(false);
      toast.success("成功新增權限");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        {
          <form
            id="xx"
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
            className={cn(`flex h-[610px] w-[790px] flex-col pb-5`)}
          >
            <DialogHeader className="relative isolate mb-5 block overflow-auto px-14">
              <div className="sticky top-0 z-10 -mx-14 -mb-px h-[110px] border-b border-b-line-gray bg-white [clip-path:polygon(0_0,100%_0,100%_calc(100%-1px),calc(100%-56px)_calc(100%-1px),calc(100%-56px)_100%,56px_100%,56px_calc(100%-1px),0_calc(100%-1px))]">
                <h1 className="bg-light-gray py-2 text-center">選擇人員</h1>
              </div>
              <ModalDataTable
                columns={userColumns}
                data={allUsers}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                getRowId={(row) => row.employeeId}
              />
            </DialogHeader>
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
        }
      </DialogContent>
    </Dialog>
  );
}
