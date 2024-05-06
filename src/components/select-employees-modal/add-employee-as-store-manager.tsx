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
