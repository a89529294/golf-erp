import {
  ColumnDef,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  // getSortedRowModel,
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
import { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";
import React from "react";
import { DataTablePagination } from "@/pages/member-management/members/data-table/data-table-pagination";
import { Spinner } from "@/components/ui/spinner";

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
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  totalPages?: number;
  isFetching?: boolean;
  isFetched?: boolean;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  enableMultiRowSelection?: boolean;
  paginationStyle?: CSSProperties;
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  const search = value.toLowerCase();

  if (!row.getValue(columnId)) return false;

  const phone = row.getValue("phone")?.toString().toLowerCase() ?? "";

  return (
    phone.includes(search) ||
    (row.getValue(columnId) as string).toLowerCase().includes(search)
  );
};

const DataTable: <TData extends { id: string }, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  globalFilter,
  setGlobalFilter,
  headerRowRef,
  page,
  totalPages,
  isFetching,
  isFetched,
  sorting,
  setSorting,
  enableMultiRowSelection,
  paginationStyle,
}: DataTableProps<TData, TValue>) => ReactNode = React.memo(function ({
  columns,
  data,
  rowSelection,
  setRowSelection,
  globalFilter,
  setGlobalFilter,
  headerRowRef,
  page,
  setPage,
  totalPages,
  isFetching,
  isFetched,
  sorting,
  setSorting,
  enableMultiRowSelection,
  paginationStyle,
}) {
  // const [sorting, setSorting] = useState<SortingState>([]);

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
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
    state: {
      rowSelection,
      globalFilter,
      sorting,
    },
  });

  return (
    <div className="absolute inset-0  m-1 mb-2.5 mt-0 w-fit border-line-gray sm:w-full">
      <Table
        outerDivClassName="h-full relative sm:overflow-scroll"
        className="isolate table-fixed items-stretch sm:w-auto"
      >
        <TableHeader className="relative z-10 [&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b-0 border-b-line-gray"
              ref={headerRowRef ? headerRowRef : undefined}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    // height of header 80 plus gap 10
                    className={cn(
                      "sticky top-[90px] bg-light-gray hover:bg-light-gray sm:top-0",
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

        {isFetching && !isFetched ? (
          <TableBody className="absolute inset-0 flex grow items-center justify-center sm:fixed">
            <tr>
              <td>
                <Spinner />
              </td>
            </tr>
          </TableBody>
        ) : (
          <TableBody className="[&_tr:last-child]:border-px ">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group border-b-line-gray bg-white data-[state=selected]:border-b-orange"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className=" py-[18px] last-of-type:px-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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
        )}
      </Table>

      {page && setPage && totalPages && (
        <DataTablePagination
          currentPage={page}
          totalPages={totalPages}
          setPage={setPage}
          paginationStyle={paginationStyle ?? {}}
        />
      )}
    </div>
  );
});

export { DataTable };
