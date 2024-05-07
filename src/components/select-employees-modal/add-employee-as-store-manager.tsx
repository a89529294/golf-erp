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
import { Employee } from "@/pages/system-management/personnel-management/loader";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactElement, useState } from "react";
import { columns as employeeColumns } from "./columns";
import { EmployeesModalSearchHeader } from "@/components/employees-modal-search-header";

export function AddEmployeeAsStoreManagerModal({
  dialogTriggerChildren,
  employees,
  onConfirm,
}: {
  dialogTriggerChildren: ReactElement;
  employees: Employee[];
  onConfirm: (selectedEmployees: Employee[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined,
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const filteredEmployees = selectedStoreId
    ? employees.filter((u) => u.stores?.[0]?.id === selectedStoreId)
    : employees;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        <form
          id="xx"
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm(employees.filter((e) => rowSelection[e.id]));
            setOpen(false);
            e.stopPropagation();
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
              columns={employeeColumns}
              data={filteredEmployees}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </DialogHeader>
          <DialogFooter className="justify-center ">
            <TextButton type="submit" form="xx">
              確定
            </TextButton>
            <DialogPrimitive.Close asChild>
              <TextWarningButton>取消</TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
