import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { invitationDetailsSchema } from "../loader";
import { storesWithoutEmployeesQuery } from "../new/loader";
import { membersQuery } from "@/pages/member-management/loader";

export const genInvitationDetailsQuery = (id: string) => ({
  queryKey: ["invitations", id],
  queryFn: async () => {
    const response = await privateFetch(
      `/store/golf/invite/${id}?populate=store&populate=members&populate=host`,
    );
    const data = await response.json();

    return invitationDetailsSchema.parse(data);
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  const x = await Promise.all([
    queryClient.ensureQueryData(storesWithoutEmployeesQuery),
    queryClient.ensureQueryData(membersQuery),
    queryClient.ensureQueryData(
      genInvitationDetailsQuery(params.invitationId!),
    ),
  ]);

  return {
    stores: x[0],
    appUsers: x[1],
    invitation: x[2],
  };
}
