import { StoreSelect } from "@/components/category/store-select";
import { IconButton } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { columns } from "@/pages/indoor-simulator/appointment-management/data-table/columns";
import { DataTable } from "@/pages/indoor-simulator/appointment-management/data-table/table";
import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
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
  const currentDataRef = useRef({
    exportDataAsXlsx: (storeName?: string) => {},
  });
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
              console.log(currentDataRef.current.exportDataAsXlsx);
              currentDataRef.current.exportDataAsXlsx(
                stores.find((store) => store.id === storeId)?.name,
              );
            }}
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
