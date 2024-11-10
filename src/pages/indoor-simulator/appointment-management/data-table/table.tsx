import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Appointment } from "@/types-and-schemas/appointment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scrollbar } from "@radix-ui/react-scroll-area";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Appointment, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    getRowId: (originalRow) => originalRow.id,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="relative flex-1 border border-t-0 border-line-gray">
      <div className="absolute inset-0">
        <ScrollArea className="h-full">
          <Table
            outerDivClassName="w-auto "
            className="w-auto min-w-full border-separate border-spacing-0"
          >
            <TableHeader className="[&_tr]:border-b-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="sticky top-0 bg-light-gray "
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border-t border-line-gray"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, i) => {
                  const originAmount =
                    row.original.originAmount ??
                    row.original.amount +
                      (row.original.usedCoupon?.[0]?.amount ?? 0);
                  const percentOff = (
                    ((originAmount - row.original.amount) / originAmount) *
                    100
                  ).toFixed(2);

                  return (
                    <>
                      <TableRow
                        key={row.id + "1"}
                        data-state={row.getIsSelected() && "selected"}
                        className="hl-next-tr group bg-white"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            // className="border-b border-line-gray"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow
                        key={row.id + "2"}
                        data-state={row.getIsSelected() && "selected"}
                        className="group bg-white"
                      >
                        <TableCell
                          colSpan={6}
                          className="border-b border-line-gray pt-0"
                        >
                          <div className="flex gap-2.5">
                            <div className="flex w-[158px] gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  付款方式
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.order?.paymentMethod ?? "現金"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  狀態
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.status}
                                </p>
                              </div>
                            </div>

                            <div className="flex  gap-7 rounded border border-line-gray bg-black/5 px-3 py-2.5">
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  原訂單金額
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.originAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  折數%
                                </p>
                                <p className="text-secondary-purple">
                                  {percentOff}
                                </p>
                              </div>

                              <div className="w-36 ">
                                <p className="text-sm font-medium text-secondary-dark">
                                  優惠券名稱
                                </p>
                                <p className="truncate text-secondary-purple">
                                  {row.original.usedCoupon?.[0]?.name}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  優惠券金額
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.usedCoupon?.[0]?.amount}
                                </p>
                              </div>

                              <div className="w-10">
                                <p className="text-sm font-medium text-secondary-dark">
                                  折扣
                                </p>
                                <p className="text-secondary-purple">
                                  {originAmount - row.original.amount}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm font-medium text-secondary-dark">
                                  實際付款金額
                                </p>
                                <p className="text-secondary-purple">
                                  {row.original.amount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    查無資料
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Scrollbar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
