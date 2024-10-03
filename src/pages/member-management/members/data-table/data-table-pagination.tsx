export function DataTablePagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}) {
  return (
    <div className="flex h-10 items-center justify-center">
      <button>prev</button>
      <button onClick={() => setPage((p) => ++p)}>next</button>
    </div>
  );
}
