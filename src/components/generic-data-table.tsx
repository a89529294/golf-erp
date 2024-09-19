import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection?: Record<string, boolean>;
  setRowSelection?: Dispatch<SetStateAction<Record<string, boolean>>>;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<SetStateAction<string>>;
  removeLastTrBorder?: boolean;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  if (!row.getValue(columnId)) return false;

  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

export function GenericDataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  globalFilter,
  setGlobalFilter,
  removeLastTrBorder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    enableRowSelection: !!rowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
      globalFilter,
      sorting,
    },
  });

  // const extraClasses = "table-fixed w-auto ";
  return (
    <div className="relative w-full px-1 border-b border-x border-line-gray ">
      <Table
        className={cn(
          `relative isolate border-separate border-spacing-0 `,
          // extraClasses,
        )}
      >
        <TableHeader className="relative z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-line-gray">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "sticky top-0 whitespace-nowrap border-y border-line-gray bg-light-gray before:absolute before:-left-1 before:-top-px before:h-px before:w-1 after:absolute after:-right-1 after:-top-px after:h-px after:w-1 first-of-type:before:bg-line-gray last-of-type:after:bg-line-gray hover:bg-light-gray ",
                    )}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : "auto",
                    }}
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

        <TableBody className="relative ">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={
                  row.getCanSelect() && row.getIsSelected() && "selected"
                }
                className="group relative bg-white data-[state=selected]:border-b-orange"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "border-b border-b-line-gray",
                      table.getRowCount() === index + 1 &&
                        removeLastTrBorder &&
                        "border-b-0",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                查無資料
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
