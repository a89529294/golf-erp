import { SiteSection } from "@/pages/driving-range/report/components/site-section";
import { ReportData } from "@/pages/driving-range/report/loader";
import { GroundStoreWithSites } from "@/pages/store-management/loader";
import { Appointment } from "@/types-and-schemas/appointment";
import { useParams } from "react-router-dom";

export function SitesList({
  stores,
  data,
}: {
  stores: GroundStoreWithSites[];
  data: ReportData;
}) {
  const { storeId } = useParams();

  return stores
    .find((s) => s.id === storeId)
    ?.sites.map((site) => {
      const siteAppointments: Appointment[] = [];
      Object.values(data.detailed).forEach((v) => {
        const appointments = v.storeGroundAppointments[site.id] ?? [];
        siteAppointments.push(...appointments);
      });

      return (
        <SiteSection
          key={site.id}
          id={site.id}
          appointments={siteAppointments}
          title={site.name}
          data={data}
        />
      );
    });
}
