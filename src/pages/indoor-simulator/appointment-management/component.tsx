import { QueryParamSelect } from "@/components/query-param-select";
import { MainLayout } from "@/layouts/main-layout";
import { indoorSimulatorStoresQuery } from "@/pages/indoor-simulator/site-management/loader";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { loader } from "./loader";

export function Component() {
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data } = useQuery({
    ...indoorSimulatorStoresQuery,
    initialData: initialData,
  });

  return (
    <MainLayout
      headerChildren={
        <QueryParamSelect
          options={data}
          optionKey="id"
          optionValue="name"
          placeholder="請選廠商"
          queryKey="storeId"
        />
      }
    >
      hi
    </MainLayout>
  );
}
