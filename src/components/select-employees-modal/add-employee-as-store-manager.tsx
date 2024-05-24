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
  selectedEmployees,
}: {
  dialogTriggerChildren: ReactElement;
  employees: Employee[];
  onConfirm: (selectedEmployees: Employee[]) => void;
  selectedEmployees?: Employee[];
}) {
  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    selectedEmployees
      ? (() => {
          const obj: Record<string, true> = {};

          selectedEmployees.forEach((e) => (obj[e.id] = true));

          return obj;
        })()
      : {},
  );
  console.log(rowSelection);

  const [selectedStoreId, setSelectedStoreId] = useState<string | undefined>(
    undefined,
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const filteredEmployees = selectedStoreId
    ? employees.filter((e) => {
        if (e.stores)
          return e.stores.map((s) => s.id).includes(selectedStoreId);
        return false;
      })
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
              columns={[
                ...employeeColumns.slice(0, -2),
                employeeColumns.at(-1)!,
              ]}
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
