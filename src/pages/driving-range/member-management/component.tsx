import { MemberManagementPage } from "@/components/member-management/page";
import { loader } from "./loader";

export function Component() {
  return <MemberManagementPage category="ground" loader={loader} />;
}
