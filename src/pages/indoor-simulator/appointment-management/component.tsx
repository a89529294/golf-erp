import { StoreSelect } from "@/components/category/store-select";
import { IconButton } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { columns } from "@/pages/indoor-simulator/appointment-management/data-table/columns";
import { DataTable } from "@/pages/indoor-simulator/appointment-management/data-table/table";
import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { Appointment } from "@/types-and-schemas/appointment";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import {
  AppointmentsResponse,
  PaginationParams,
  appointmentsQuery,
  loader,
} from "./loader";

export function Component() {
  const currentDataRef = useRef<{
    exportDataAsXlsx: (storeName?: string, data?: Appointment[]) => void;
  }>({ exportDataAsXlsx: () => {} });
  // const [site, setSite] = useState("all");
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  // Get pagination parameters from URL or use defaults
  const page = parseInt(searchParams.get("page") || "1", 10);
  const site = searchParams.get("siteId");

  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
    initialData: initialData.stores,
    staleTime: 5000,
  });

  const storeId = searchParams.get("storeId")!;

  // const { data: appointmentsData } = useQuery({
  //   ...appointmentsQuery(page, pageSize, storeId),
  //   initialData,
  // });

  const storesWithSiteAppointments = initialData.storesWithSiteAppointments;
  const pagination = initialData.pagination;

  const store = storesWithSiteAppointments.find((s) => s.id === storeId);

  // const siteOptions = [{ id: "all", name: "全部" }, ...(store?.sites ?? [])];
  const siteOptions = [{ id: "all", name: "全部" }, ...initialData.sites];

  // const filteredData = (() => {
  //   if (site === "all")
  //     return store?.sites.flatMap((s) => s.appointments) ?? [];

  //   return (
  //     store?.sites
  //       .filter((s) => s.id === site)
  //       .flatMap((s) => s.appointments) ?? []
  //   );
  // })();
  const filteredData = store?.sites.flatMap((s) => s.appointments) ?? [];

  const [isExporting, setIsExporting] = useState(false);
  const { data: allAppointmentsData, isFetching: isFetchingAllAppointments } =
    useQuery({
      ...appointmentsQuery(
        1,
        9999,
        storeId,
        site ?? "all",
        searchParams.get("sortField") ?? undefined,
        searchParams.get("sortOrder") ?? undefined,
      ),
      enabled: isExporting,
    });

  console.log("wtf");
  console.log(allAppointmentsData);

  const deduct8Hours = (datetimeStr: string): string => {
    const date = new Date(datetimeStr);
    date.setHours(date.getHours() - 8);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (allAppointmentsData && isExporting) {
      const allAppointments = allAppointmentsData.storesWithSiteAppointments
        .flatMap((s) => s.sites)
        .flatMap((s) => s.appointments)
        .map((v) => ({
          ...v,
          startTime: deduct8Hours(v.startTime),
          endTime: deduct8Hours(v.endTime),
        }));
      console.log(
        allAppointments.find(
          (v) => v.id === "a0fcc5f0-146f-40ac-a7ae-204f1048b5de",
        ),
      );
      currentDataRef.current.exportDataAsXlsx(
        stores.find((store) => store.id === storeId)?.name,
        allAppointments,
      );
      setIsExporting(false); // Reset after export
    }
  }, [allAppointmentsData, isExporting, stores, storeId]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());

      return newParams;
    });
  };

  const handleSortChange = (sortField: string, sortOrder: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      // Reset to page 1 when sorting changes
      newParams.set("page", "1");

      if (sortField && sortOrder) {
        newParams.set("sortField", sortField);
        newParams.set("sortOrder", sortOrder);
      } else {
        // Clear sort params if no sorting
        newParams.delete("sortField");
        newParams.delete("sortOrder");
      }

      return newParams;
    });
  };

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect
            category="simulator"
            initialData={stores}
            navigateTo={""}
            // onSelect={() => {
            //   setSearchParams((prev) => {
            //     const searchParams = new URLSearchParams(prev);
            //     searchParams.set("page", "1");
            //     return searchParams;
            //   });
            // }}
          />
          <IconButton
            icon="save"
            onClick={() => {
              setIsExporting(true);
            }}
            disabled={isFetchingAllAppointments}
          >
            下載xlsx
          </IconButton>
        </>
      }
    >
      {({ height }) => {
        return (
          <div
            className="flex w-full flex-col border border-line-gray bg-light-gray p-1"
            style={{ height }}
          >
            <nav>
              <ul className="isolate flex items-center gap-3 overflow-x-auto py-2 pl-5">
                {siteOptions
                  .sort((a, b) =>
                    a.name === "全部" ? -1 : a.name.localeCompare(b.name),
                  )
                  .map(({ id, name }) => (
                    <li key={id}>
                      <button
                        onClick={() => {
                          setSearchParams((prev) => {
                            const searchParams = new URLSearchParams(prev);
                            searchParams.set("siteId", id);
                            searchParams.set("page", "1");
                            return searchParams;
                          });
                        }}
                        className={cn(
                          "relative grid h-9 place-items-center whitespace-nowrap rounded-full border border-line-gray bg-white px-5",
                        )}
                      >
                        {site === id && (
                          <motion.div
                            className="absolute inset-0 z-10 rounded-full bg-black"
                            layoutId="site-tab"
                            transition={{
                              duration: 0.3,
                            }}
                          />
                        )}
                        <div
                          className={cn(
                            "relative z-20 transition-colors duration-300",
                            site === id && "text-white",
                          )}
                        >
                          {name}
                        </div>
                      </button>
                    </li>
                  ))}
              </ul>
            </nav>

            <DataTable
              currentDataRef={currentDataRef}
              columns={columns}
              data={filteredData}
              page={page}
              setPage={handlePageChange}
              totalPages={pagination.pageCount}
              onSortChange={handleSortChange}
              height={height}
            />
          </div>
        );
      }}
    </MainLayout>
  );
}
