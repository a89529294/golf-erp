import { MemberManagementPage } from "@/components/member-management/page";
import { loader } from "@/pages/indoor-simulator/member-management/loader";

export function Component() {
  return <MemberManagementPage category="simulator" loader={loader} />;
}
