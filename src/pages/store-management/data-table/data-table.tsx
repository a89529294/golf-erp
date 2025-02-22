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
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import blackFileIcon from "@/assets/black-file-icon.svg";

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
  tableHeaderClassName?: string;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  if (!row.getValue(columnId)) return false;

  return (row.getValue(columnId) as string)
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
  tableHeaderClassName,
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
    <div className="w-full border-b border-line-gray">
      <Table className="relative isolate border-separate border-spacing-0">
        <TableHeader className="relative z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b-line-gray">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      // "sticky top-[90px] bg-light-gray hover:bg-light-gray sm:top-px ",
                      " sticky top-0 whitespace-nowrap border-y border-line-gray bg-light-gray hover:bg-light-gray ",
                      tableHeaderClassName,
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
            table.getRowModel().rows.map((row, rowIdx) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group relative border-b-line-gray bg-white data-[state=selected]:border-b-orange"
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "border-b border-line-gray",
                      rowIdx === table.getRowModel().rows.length - 1 &&
                        "border-b-0",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    {row.getVisibleCells().length === idx + 1 && (
                      <Link
                        className="absolute right-5 top-1/2 hidden -translate-y-1/2 group-hover:block sm:right-5 sm:block"
                        to={`/store-management/details/${row.original.id}`}
                      >
                        <img src={blackFileIcon} />
                      </Link>
                    )}
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
