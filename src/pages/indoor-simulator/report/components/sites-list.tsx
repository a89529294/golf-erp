import { SiteSection } from "@/pages/indoor-simulator/report/components/site-section";
import { DetailedData, YearData } from "@/pages/indoor-simulator/report/loader";
import { SimulatorStoreWithSites } from "@/pages/store-management/loader";
import { Appointment } from "@/types-and-schemas/appointment";
import { useParams } from "react-router-dom";

export function SitesList({
  stores,
  data,
}: {
  stores: SimulatorStoreWithSites[];
  data: {
    year: YearData;
    detailed: DetailedData;
  };
}) {
  const { storeId } = useParams();
  const currentYearRevenueForAllSites = Object.values(data.year).reduce(
    (acc, v) => acc + v.totalAmount,
    0,
  );
  return stores
    .find((s) => s.id === storeId)
    ?.sites.map((site) => {
      const siteAppointments: Appointment[] = [];
      Object.values(data.detailed).forEach((v) => {
        const appointments = v.storeSimulatorAppointments[site.id] ?? [];
        siteAppointments.push(...appointments);
      });

      return (
        <SiteSection
          key={site.id}
          id={site.id}
          appointments={siteAppointments}
          title={site.name}
          data={data}
          currentYearRevenueForAllSites={currentYearRevenueForAllSites}
        />
      );
    });
}
