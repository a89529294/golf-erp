import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import { groundStoresQuery } from "@/pages/driving-range/site-management/loader";
import { DataTable } from "@/pages/indoor-simulator/appointment-management/data-table/table";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { columns } from "../../indoor-simulator/appointment-management/data-table/columns.tsx";
import { appointmentsQuery, loader } from "./loader";
import { IconButton } from "@/components/ui/button.tsx";
import { StoreSelect } from "@/components/category/store-select.tsx";

export function Component() {
  const currentDataRef = useRef({
    exportDataAsXlsx: (storeName?: string) => {},
  });
  const [site, setSite] = useState("all");
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...groundStoresQuery(user!.isAdmin ? "all" : user!.allowedStores.ground),
    initialData: initialData.stores,
  });
  const { data: storesWithSiteAppointments } = useQuery({
    ...appointmentsQuery,
    initialData: initialData.storesWithSiteAppointments,
  });

  const storeId = searchParams.get("storeId");

  const store = storesWithSiteAppointments.find((s) => s.id === storeId);

  const siteOptions = [{ id: "all", name: "全部" }, ...(store?.sites ?? [])];

  const filteredData = (() => {
    if (site === "all")
      return store?.sites.flatMap((s) => s.appointments) ?? [];

    return (
      store?.sites
        .filter((s) => s.id === site)
        .flatMap((s) => s.appointments) ?? []
    );
  })();

  return (
    <MainLayout
      headerChildren={
        <>
          <StoreSelect category="ground" initialData={stores} navigateTo={""} />
          <IconButton
            icon="save"
            onClick={() => {
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
      {/* <div className="mb-2.5 flex-1 border border-line-gray bg-light-gray p-4">
        {!store ? (
          <h1>查無資料</h1>
        ) : (
          store.sites.map((site) => (
            <section key={site.id} className="space-y-1">
              <h2>{site.name}</h2>
              <ScrollArea
                viewportCN="max-h-[200px] h-auto"
                className="h-auto sm:w-[calc(100vw-54px)]"
              >
                <DataTable columns={columns} data={site.appointments} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>
          ))
        )}
      </div> */}
      {({ height }) => {
        return (
          <div className="flex w-full flex-col border border-line-gray bg-light-gray p-1">
            <nav
            // ref={(e) => {
            //   setNav(e);
            // }}
            >
              <ul className="isolate flex items-center gap-3 overflow-x-auto py-2 pl-5">
                {siteOptions
                  .sort((a, b) =>
                    a.name === "全部" ? -1 : a.name.localeCompare(b.name),
                  )
                  .map(({ id, name }) => (
                    <li key={id}>
                      <button
                        onClick={() => setSite(id)}
                        className={cn(
                          "relative grid h-9 place-items-center rounded-full border border-line-gray bg-white px-5",
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
              {/* <div className="hidden pb-1 sm:block">
                <Select value={site ?? ""} onValueChange={setSite}>
                  <SelectTrigger className="grid px-5 text-white border rounded-full h-9 place-items-center border-line-gray bg-secondary-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {siteOptions.map(({ id, name }) => {
                      return (
                        <SelectItem value={id} key={id}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div> */}
            </nav>

            <DataTable
              currentDataRef={currentDataRef}
              columns={columns}
              data={filteredData}
            />
          </div>
        );
      }}
    </MainLayout>
  );
}
