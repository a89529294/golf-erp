import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { memberSchema } from "../loader";

export const genMemberDetailsQuery = (id: string) => ({
  queryKey: ["members", id],
  queryFn: async () => {
    const response = await privateFetch(`/app-users/${id}`);

    const inCompleteData = await response.json();

    const completeData = memberSchema.parse({
      ...inCompleteData,
      isActive: true,
      cardNumber: "123321",
    });

    return completeData;
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  return await queryClient.ensureQueryData(genMemberDetailsQuery(params.id!));
}
