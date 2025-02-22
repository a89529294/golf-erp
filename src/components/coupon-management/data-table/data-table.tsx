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
  const [sorting, setSorting] = useState<SortingState>([
    { id: "number", desc: false },
  ]);

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
    <div className="m-1 mt-0 w-fit sm:w-max">
      <Table className="relative isolate table-fixed sm:w-max">
        <TableHeader className="relative z-10 [&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-line-gray">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    // height of header 80 plus gap 10
                    className={cn(
                      "sticky top-[90px] bg-light-gray hover:bg-light-gray sm:top-0",
                      rmTheadMarginTop && "top-0",
                    )}
                    style={{
                      width: header.column.columnDef.size
                        ? `${header.column.columnDef.size}%`
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
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group relative border-b-line-gray bg-white data-[state=selected]:border-b-orange"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last-of-type:px-0">
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
