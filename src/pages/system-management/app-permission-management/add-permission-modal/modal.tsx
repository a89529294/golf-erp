import { EmployeesModalSearchHeader } from "@/components/employees-modal-search-header";
import { ModalDataTable } from "@/components/select-employees-modal/data-table";
import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppPermissionUser } from "@/pages/system-management/app-permission-management/loader";
import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactElement, useState } from "react";
import { toast } from "sonner";
import { columns as userColumns } from "./columns";

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

  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined,
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const filteredUsers = selectedStoreId
    ? allUsers.filter((u) => u.store?.id === selectedStoreId)
    : allUsers;

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
              <EmployeesModalSearchHeader
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
              />
              <ModalDataTable
                columns={userColumns}
                data={filteredUsers}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                getRowId={(row) => row.employeeId}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
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
