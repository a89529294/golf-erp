import { SiteSection } from "@/pages/indoor-simulator/report/components/site-section";
import { Order, ReportData } from "@/pages/indoor-simulator/report/loader";
import { useParams } from "react-router-dom";

export function SitesList({
  stores,
  data,
}: {
  stores: { id: string; name: string; merchantId: string }[];
  data: ReportData;
}) {
  const { storeId } = useParams();

  const unfilteredSites = Object.values(data.total.orders).map((v) => {
    if (!v.simulatorAppointment) return null;

    return v.simulatorAppointment.storeSimulator;
  });

  const foundSiteIds: Record<string, boolean> = {};

  const sites = unfilteredSites.filter(
    (
      v,
    ): v is {
      id: string;
      name: string;
    } => {
      if (!!v && !foundSiteIds[v.id]) {
        foundSiteIds[v.id] = true;
        return true;
      }

      return false;
    },
  );

  return sites
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((site) => {
      const siteAppointments: Order[] = [];
      Object.values(data.detailed).forEach((v) => {
        v.orders.forEach((order) => {
          if (!order.simulatorAppointment) return;
          if (order.simulatorAppointment.storeSimulator.id === site.id)
            siteAppointments.push(order);
        });
      });

      return (
        <SiteSection
          key={site.id}
          id={site.id}
          appointments={siteAppointments}
          title={site.name}
          data={data}
          merchantId={stores.find((store) => store.id === storeId)?.merchantId}
        />
      );
    });
}
