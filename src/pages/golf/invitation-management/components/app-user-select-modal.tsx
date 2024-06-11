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
import { SimpleMember } from "@/pages/member-management/loader";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { formSchema } from "..";
import { z } from "zod";

export function AppUserSelectModal({
  columns,
  dialogTriggerChildren,
  appUsers,
  onSubmit,
  isPending,
  enableMultiRowSelection,
}: {
  columns: ColumnDef<SimpleMember>[];
  dialogTriggerChildren: ReactElement;
  appUsers: SimpleMember[];
  onSubmit: (users: SimpleMember[]) => void;
  isPending: boolean;
  enableMultiRowSelection: boolean;
}) {
  const form = useFormContext() as UseFormReturn<z.infer<typeof formSchema>>;

  const [open, setOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState(
    form.watch("members").reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: true,
      };
    }, {}),
  );
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setRowSelection(
          form.watch("members").reduce((acc, curr) => {
            return {
              ...acc,
              [curr.id]: true,
            };
          }, {}),
        );
      }}
    >
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        {
          <form
            id="xx"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(
                Object.keys(rowSelection).map(
                  (userId) => appUsers.find((au) => au.id === userId)!,
                ),
              );
              setOpen(false);
            }}
            className={cn(`flex h-[610px] w-[790px] flex-col pb-5`)}
          >
            <DialogHeader className="relative isolate mb-5 block overflow-auto px-14">
              <EmployeesModalSearchHeader
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
              <ModalDataTable
                columns={columns}
                data={appUsers}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                getRowId={(row) => row.id}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                enableMultiRowSelection={enableMultiRowSelection}
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
