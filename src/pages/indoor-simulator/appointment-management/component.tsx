import { QueryParamSelect } from "@/components/query-param-select";
import { MainLayout } from "@/layouts/main-layout";
import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { appointmentsQuery, loader } from "./loader";
import { DataTable } from "@/pages/indoor-simulator/appointment-management/data-table/table";
import { columns } from "@/pages/indoor-simulator/appointment-management/data-table/columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

export function Component() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: stores } = useQuery({
    ...indoorSimulatorStoresQuery(
      user!.isAdmin ? "all" : user!.allowedStores.simulator,
    ),
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
          className="w-56"
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
              <ScrollArea viewportCN="max-h-[200px] h-auto" className="h-auto">
                <DataTable columns={columns} data={site.appointments} />
              </ScrollArea>
            </section>
          ))
        )}
      </div>
    </MainLayout>
  );
}
