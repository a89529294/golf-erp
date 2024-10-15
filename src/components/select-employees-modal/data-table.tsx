import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction } from "react";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: Record<string, boolean>;
  setRowSelection: Dispatch<SetStateAction<Record<string, boolean>>>;
  getRowId?: (row: TData) => string;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  enableMultiRowSelection?: boolean;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  if (!row.getValue(columnId)) return false;

  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

export function ModalDataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  getRowId,
  globalFilter,
  setGlobalFilter,
  enableMultiRowSelection,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    enableMultiRowSelection: !!enableMultiRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getRowId:
      getRowId ??
      function (row) {
        return row.id;
      },
    state: {
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="relative w-full flex-1 overflow-auto border border-line-gray sm:h-full ">
      <Table outerDivClassName="absolute inset-0" className="relative isolate ">
        <TableHeader className="relative z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    // height of header 80 plus gap 10
                    className="sticky top-0 bg-light-gray hover:bg-light-gray sm:top-0 sm:whitespace-nowrap"
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

        <TableBody className="relative">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.original.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-2.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                請先選擇主辦人
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
