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
import { CSSProperties, Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";

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
  headerRowRef?: React.RefObject<HTMLTableRowElement>;
  style?: CSSProperties;
}

// Tip: If you find yourself using <DataTable /> in multiple places,
// this is the component you could make reusable by extracting it
// to components/ui/data-table.tsx.
// <DataTable columns={columns} data={data} />

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
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
  headerRowRef,
  style,
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
    <div className="" style={style}>
      <Table
        outerDivClassName=""
        className="relative isolate table-fixed border-separate border-spacing-0 sm:w-auto"
      >
        <TableHeader className="relative z-10 [&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className=""
              ref={headerRowRef ? headerRowRef : undefined}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    // height of header 80 plus gap 10
                    className={cn(
                      "sticky top-0 w-full whitespace-nowrap border-y border-line-gray bg-light-gray hover:bg-light-gray sm:top-0",
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
            table.getRowModel().rows.map((row, rowIdx) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "border-b border-line-gray",
                        table.getRowModel().rows.length === rowIdx + 1 &&
                          "border-b-0",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
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
