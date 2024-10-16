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
  rowSelection: Record<string, boolean>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  rmTheadMarginTop?: boolean;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  console.log(1);
  if (!row.getValue(columnId)) return false;
  console.log(row.getValue(columnId), columnId);

  return (`${row.getValue(columnId)}` as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  globalFilter,
  setGlobalFilter,
  rmTheadMarginTop,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
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

  return (
    <Table className="relative isolate table-fixed border-separate border-spacing-0">
      <TableHeader className="relative z-10 ">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  // height of header 80 plus gap 10
                  className={cn(
                    "sticky top-0 border-y border-y-line-gray bg-light-gray  hover:bg-light-gray ",
                    rmTheadMarginTop && "top-0",
                  )}
                  style={{
                    width:
                      header.column.columnDef.size !== 150
                        ? `${header.column.columnDef.size}px`
                        : "auto",
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
          table.getRowModel().rows.map((row, rowIdx) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="group relative bg-white "
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "border-b border-line-gray last-of-type:px-0",
                    rowIdx + 1 === table.getRowCount() && "border-b-0",
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
  );
}
