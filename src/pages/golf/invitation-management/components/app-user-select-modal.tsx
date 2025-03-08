import { EmployeesModalSearchHeader } from "@/components/employees-modal-search-header";
import { TextButton, TextWarningButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import { DataTable } from "@/pages/member-management/members/data-table/data-table.tsx";
import {
  SimpleMember,
  genMembersQuery,
} from "@/pages/member-management/members/loader";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { ReactElement, useState } from "react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "..";

export function AppUserSelectModal({
  type,
  columns,
  dialogTriggerChildren,
  onSubmit,
  isPending,
  enableMultiRowSelection,
  hostValue,
}: {
  type: "host" | "members";
  hostValue?: { id: string };
  columns: ColumnDef<SimpleMember>[];
  dialogTriggerChildren: ReactElement;
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
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);
  const debouncedGlobalFilter = useDebouncedValue(globalFilter, 500);
  const [page, setPage] = useState(1);

  const { data, isFetching, isFetched } = useQuery({
    ...genMembersQuery(page, {
      sort: sorting[0].id,
      order: sorting[0].desc ? "DESC" : "ASC",
      filter: debouncedGlobalFilter,
      pageSize: 5,
      // populate: ["store", "storeAppUsers"],
    }),
  });

  // const appUsersMinusHost = hostValue
  //   ? data?.data.filter((appUser) => appUser.id !== hostValue.id)
  //   : [];

  // const appUsers = (isMembers ? appUsersMinusHost : data?.data) ?? [];
  const appUsers = data?.data ?? [];
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
                console.log(
                  Object.keys(rowSelection).map(
                    (userId) => appUsers.find((au) => au.id === userId)!,
                  ),
                );
                onSubmit(
                  Object.keys(rowSelection).map(
                    (userId) => appUsers.find((au) => au.id === userId)!,
                  ),
                );
              } else {
                console.log(
                  Object.keys(rowSelection)
                    .slice(0, +form.getValues("headcount"))
                    .map((userId) => appUsers.find((au) => au.id === userId)!),
                );
                onSubmit(
                  Object.keys(rowSelection)
                    .slice(0, +form.getValues("headcount") - 1)
                    .map((userId) => appUsers.find((au) => au.id === userId)!),
                );
              }
              setOpen(false);
            }}
            className={cn(`flex h-[610px] w-[790px] flex-col pb-5 sm:w-80`)}
          >
            <DialogHeader className="relative isolate mb-5 flex flex-col overflow-auto px-14 sm:px-6">
              <EmployeesModalSearchHeader
                globalFilter={globalFilter}
                setGlobalFilter={(v) => {
                  setGlobalFilter(v);
                  setPage(1);
                }}
                disableStoreQuery
                className="self-stretch sm:-mx-6"
              />
              <div className="relative w-full flex-1">
                <DataTable
                  columns={columns}
                  data={appUsers}
                  rowSelection={rowSelection}
                  setRowSelection={setRowSelection}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  enableMultiRowSelection={enableMultiRowSelection}
                  sorting={sorting}
                  setSorting={setSorting}
                  page={page}
                  setPage={setPage}
                  totalPages={data?.meta.pageCount ?? 0}
                  isFetching={isFetching}
                  isFetched={isFetched}
                  paginationStyle={{
                    bottom: 0,
                  }}
                />
              </div>
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
      <DialogTitle />
    </Dialog>
  );
}
