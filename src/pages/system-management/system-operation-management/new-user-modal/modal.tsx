import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactElement, useEffect, useState } from "react";
import { columns as employeeColumns } from "@/pages/system-management/system-operation-management/new-user-modal/columns";
import { ModalDataTable } from "@/pages/system-management/system-operation-management/new-user-modal/data-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";
import { userSchema } from "@/pages/system-management/system-operation-management/loader";
import { PasswordModalContent } from "@/pages/system-management/system-operation-management/password-modal/modal-content";
import { Employee } from "@/pages/system-management/personnel-management/loader";

const newERPUserReturnSchema = z.object({
  user: userSchema,
  password: z.string(),
});

export function NewUserModal({
  dialogTriggerChildren,
  employees,
}: {
  dialogTriggerChildren: ReactElement;
  employees: Employee[];
}) {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [newERPUserChName, setNewERPUserChName] = useState("");
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const { mutate, isPending } = useMutation({
    mutationKey: ["add-employee-as-erp-user"],
    mutationFn: async () => {
      const response = await privateFetch(
        `/employees/${Object.keys(rowSelection)[0]}/erp-user`,
        {
          method: "POST",
        },
      );

      const data = newERPUserReturnSchema.parse(await response.json());

      setNewERPUserChName(data.user.username);
      setPassword(data.password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const numberOfNewUsers = Object.keys(rowSelection).length;
  // only allow 1 new user at a time
  useEffect(() => {
    if (numberOfNewUsers > 1) {
      setRowSelection((prev) => {
        return { [Object.keys(prev)[1]]: true };
      });
    }
  }, [numberOfNewUsers]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        {password ? (
          <PasswordModalContent
            chName={newERPUserChName}
            password={password}
            onConfirm={() => setOpen(false)}
          />
        ) : (
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
                columns={employeeColumns}
                data={employees}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
