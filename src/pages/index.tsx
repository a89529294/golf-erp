import { Navigate } from "react-router-dom";

export default function Index() {
  return <Navigate to={"/member-management/members"} replace />;
}
