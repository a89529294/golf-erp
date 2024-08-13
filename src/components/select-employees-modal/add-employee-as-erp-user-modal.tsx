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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";
import { userSchema } from "@/pages/system-management/system-operation-management/loader";
import { PasswordModalContent } from "@/pages/system-management/system-operation-management/password-modal/modal-content";
import { Employee } from "@/pages/system-management/personnel-management/loader";
import { ModalDataTable } from "@/components/select-employees-modal/data-table";
import {
  columns as employeeColumns,
  mobileColumns as mobileEmployeeColumns,
} from "./columns";
import { EmployeesModalSearchHeader } from "@/components/employees-modal-search-header";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { useIsMobile } from "@/hooks/use-is-mobile";

const newERPUserReturnSchema = z.object({
  user: userSchema,
  password: z.string(),
});

export function AddEmployeeAsERPUserModal({
  dialogTriggerChildren,
  employees,
}: {
  dialogTriggerChildren: ReactElement;
  employees: Employee[];
}) {
  const isMobile = useIsMobile();
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

  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined,
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const filteredEmployees = selectedStoreId
    ? employees.filter((u) => u.stores?.[0]?.id === selectedStoreId)
    : employees;

  const numberOfNewUsers = Object.keys(rowSelection).length;
  useEffect(() => {
    if (numberOfNewUsers > 1) {
      setRowSelection((prev) => {
        return { [Object.keys(prev)[1]]: true };
      });
    }
  }, [numberOfNewUsers]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setPassword("");
      }}
    >
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        {password ? (
          <PasswordModalContent
            chName={newERPUserChName}
            password={password}
            onConfirm={() => {
              setOpen(false);
              requestIdleCallback(() => setPassword(""));
            }}
          />
        ) : (
          <form
            id="xx"
            onSubmit={(e) => {
              e.preventDefault();
              mutate();
            }}
            className={cn(`flex h-[610px] w-[790px] flex-col pb-5 sm:w-80`)}
          >
            <DialogHeader className="relative isolate mb-5 block overflow-auto px-14 sm:overflow-hidden sm:px-4">
              <EmployeesModalSearchHeader
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
              />
              {isMobile ? (
                <ScrollArea className="overflow-auto sm:h-[417px] sm:w-72">
                  <ModalDataTable
                    columns={mobileEmployeeColumns}
                    data={filteredEmployees}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                  />
                  <Scrollbar orientation="horizontal" />
                </ScrollArea>
              ) : (
                <ModalDataTable
                  columns={employeeColumns}
                  data={filteredEmployees}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              )}
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
