import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

function generatePagination(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  let left = currentPage - 1;
  let right = currentPage + 1;
  if (currentPage <= 4) {
    left = 2;
    right = 5;
  } else if (currentPage >= totalPages - 3) {
    left = totalPages - 4;
    right = totalPages - 1;
  }
  if (left > 2) pages.push("...");
  for (let i = left; i <= right; i++) {
    if (i > 1 && i < totalPages) pages.push(i);
  }
  if (right < totalPages - 1) pages.push("...");
  pages.push(totalPages);
  return pages;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  setPage,
  paginationStyle,
}: {
  currentPage: number;
  setPage: (page: number) => void;
  totalPages: number;
  paginationStyle?: CSSProperties;
}) {
  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div
      style={paginationStyle}
      className="absolute -bottom-20 left-1/2 inline-flex -translate-x-1/2 sm:bottom-10 sm:-translate-x-[calc(50%+5px)]"
    >
      <button>
        <PaginationArrow
          direction="left"
          onClick={() => setPage(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
      </button>

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <PaginationNumber
              key={page + String(index)}
              onClick={() => typeof page === "number" && setPage(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>

      <PaginationArrow
        direction="right"
        onClick={() => setPage(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationNumber({
  page,
  onClick,
  isActive,
  position,
}: {
  page: number | string;
  onClick: () => void;
  position?: "first" | "last" | "middle" | "single";
  isActive: boolean;
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center text-sm border",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-blue-600 border-blue-600 text-white": isActive,
      "hover:bg-gray-100": !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    },
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <button onClick={onClick} className={className}>
      {page}
    </button>
  );
}

function PaginationArrow({
  onClick,
  direction,
  isDisabled,
}: {
  onClick: () => void;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    },
  );

  const icon =
    direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <button className={className} onClick={onClick}>
      {icon}
    </button>
  );
}
