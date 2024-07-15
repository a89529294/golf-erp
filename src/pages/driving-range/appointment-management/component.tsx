import { QueryParamSelect } from "@/components/query-param-select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/layouts/main-layout";
import { groundStoresQuery } from "@/pages/driving-range/site-management/loader";
import { columns } from "./columns";
import { DataTable } from "@/pages/indoor-simulator/appointment-management/data-table/table";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { appointmentsQuery, loader } from "./loader";

export function Component() {
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

  return (
    <MainLayout
      headerChildren={
        <QueryParamSelect
          options={stores}
          optionKey="id"
          optionValue="name"
          placeholder="請選廠商"
          queryKey="storeId"
          className="w-56 sm:w-40"
        />
      }
    >
      <div className="mb-2.5 flex-1 border border-line-gray bg-light-gray p-4">
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
      </div>
    </MainLayout>
  );
}
