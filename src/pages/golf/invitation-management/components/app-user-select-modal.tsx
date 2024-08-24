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
import { SimpleMember } from "@/pages/member-management/members/loader";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "..";

export function AppUserSelectModal({
  type,
  columns,
  dialogTriggerChildren,
  appUsers,
  onSubmit,
  isPending,
  enableMultiRowSelection,
}: {
  type: "host" | "members";
  columns: ColumnDef<SimpleMember>[];
  dialogTriggerChildren: ReactElement;
  appUsers: SimpleMember[];
  onSubmit: (users: SimpleMember[]) => void;
  isPending: boolean;
  enableMultiRowSelection: boolean;
}) {
  const isMembers = type === "members";
  const form = useFormContext() as UseFormReturn<z.infer<typeof formSchema>>;
  const [rowSelection, setRowSelection] = useState(
    form
      .getValues(isMembers ? "members" : "host")
      .reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {}),
  );
  const [open, setOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (open) {
          if (!isMembers) {
            if (form.getValues("host")[0])
              setRowSelection({
                [form.getValues("host")[0].id]: true,
              });
            else setRowSelection({});
          } else {
            setRowSelection(
              form.getValues("members").reduce(
                (acc, curr) => {
                  acc[curr.id] = true;
                  return acc;
                },
                {} as Record<string, boolean>,
              ),
            );
          }
        }
      }}
    >
      <DialogTrigger asChild>{dialogTriggerChildren}</DialogTrigger>
      <DialogContent>
        {
          <form
            id="xx"
            onSubmit={(e) => {
              e.preventDefault();
              if (!isMembers) {
                onSubmit(
                  Object.keys(rowSelection).map(
                    (userId) => appUsers.find((au) => au.id === userId)!,
                  ),
                );
              } else {
                onSubmit(
                  Object.keys(rowSelection)
                    .slice(0, +form.getValues("headcount") - 1)
                    .map((userId) => appUsers.find((au) => au.id === userId)!),
                );
              }
              setOpen(false);
            }}
            className={cn(`flex h-[610px] w-[790px] flex-col pb-5`)}
          >
            <DialogHeader className="relative isolate mb-5 block overflow-auto px-14">
              <EmployeesModalSearchHeader
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                disableStoreQuery
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
