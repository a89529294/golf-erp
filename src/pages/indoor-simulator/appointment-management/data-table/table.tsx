import {
  ColumnDef,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@/types-and-schemas/appointment";
import { Scrollbar } from "@radix-ui/react-scroll-area";
import { useImperativeHandle, useState } from "react";

import { Row } from "@/pages/indoor-simulator/appointment-management/data-table/row";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { PaginationMeta } from "../loader";
import { cn } from "@/lib/utils";

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value) => {
  return (row.getValue(columnId) as string)
    .toLowerCase()
    .includes(value.toLowerCase());
};

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentDataRef: React.MutableRefObject<{ exportDataAsXlsx: () => void }>;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSortChange?: (sortField: string, sortOrder: string) => void;
  currentPage?: number;
}

export function DataTable<TData extends Appointment, TValue>({
  columns,
  data,
  currentDataRef,
  pagination,
  onPageChange,
  onSortChange,
  currentPage = 1,
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
    onSortingChange: (updater) => {
      // Handle the sorting state update
      const nextState =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(nextState);

      // Trigger server-side sorting if a handler is provided
      if (onSortChange && nextState.length > 0) {
        const sortField = nextState[0].id;
        const sortOrder = nextState[0].desc ? "DESC" : "ASC";
        onSortChange(sortField, sortOrder);
      } else if (onSortChange && nextState.length === 0) {
        // Clear sorting
        onSortChange("", "");
      }
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  useImperativeHandle(currentDataRef, () => {
    return {
      exportDataAsXlsx: (storeName?: string) => {
        const data = table.getRowModel().rows.map((r) => {
          const originAmount =
            r.original.originAmount ??
            r.original.amount + (r.original.usedCoupon?.[0]?.amount ?? 0);
          const percentOff = (
            ((originAmount - r.original.amount) / originAmount) *
            100
          ).toFixed(2);

          return {
            訂單編號: r.original.id,
            名稱: r.original.appUser?.chName,
            電話: r.original.appUser?.phone,
            開始時間: r.original.startTime,
            結束時間: r.original.endTime,
            付款方式: r.original.order?.paymentMethod ?? "點數",
            狀態: r.original.status,
            原訂單金額: originAmount,
            折數: percentOff,
            優惠券名稱: r.original.usedCoupon?.[0]?.name,
            優惠券金額: r.original.usedCoupon?.[0]?.amount,
            折扣: originAmount - r.original.amount,
            實際付款金額: r.original.amount,
          };
        });
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Calculate the maximum width for each column
        const columnWidths = (
          Object.keys(data[0]) as (keyof (typeof data)[0])[]
        ).map((key) => {
          const maxLength = Math.max(
            key.length * 2, // header length
            ...data.map((row) => {
              return row[key] ? (row[key]?.toString().length ?? 0) : 0;
            }), // max length of each cell in the column
          );
          return { wch: maxLength + 2 }; // add padding for better readability
        });

        worksheet["!cols"] = columnWidths; // Set column widths in the worksheet

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `${storeName}-預約記錄.xlsx`);
      },
    };
  });

  // Generate page numbers to display
  const generatePaginationItems = () => {
    if (!pagination) return [];

    const { page, pageCount } = pagination;
    const items = [];

    // Always show first page
    items.push(1);

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(pageCount - 1, page + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push("...");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < pageCount - 1) {
      items.push("...");
    }

    // Always show last page if there is more than one page
    if (pageCount > 1) {
      items.push(pageCount);
    }

    return items;
  };

  return (
    <div className="relative flex flex-1 flex-col border border-t-0 border-line-gray">
      <div className="relative flex-1">
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
                    return <Row key={i} row={row} />;
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

      {pagination && onPageChange && (
        <div className="flex items-center justify-center space-x-2 border-t border-line-gray bg-light-gray py-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
          >
            上一頁
          </button>

          {generatePaginationItems().map((item, index) =>
            typeof item === "number" ? (
              <button
                key={index}
                className={cn(
                  "h-8 w-8",
                  item === currentPage && "bg-black text-white",
                )}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span key={index} className="px-2">
                {item}
              </span>
            ),
          )}

          <button
            onClick={() =>
              onPageChange(Math.min(pagination.pageCount, currentPage + 1))
            }
            disabled={currentPage >= pagination.pageCount}
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
}
