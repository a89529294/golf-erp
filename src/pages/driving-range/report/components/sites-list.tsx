import { SiteSection } from "@/pages/driving-range/report/components/site-section";
import { ReportData } from "@/pages/driving-range/report/loader";
import { Appointment } from "@/types-and-schemas/appointment";
import { useParams } from "react-router-dom";

export function SitesList({
  stores,
  data,
}: {
  stores: { id: string; name: string; merchantId: string }[];
  data: ReportData;
}) {
  const { storeId } = useParams();

  const sites = Object.values(data?.total.storeGroundAppointments ?? {}).map(
    (v) => ({
      ...v.storeGround,
    }),
  );

  return sites.map((site) => {
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
        merchantId={
          stores.find((s) => s.id === storeId)?.merchantId ?? undefined
        }
      />
    );
  });
}
