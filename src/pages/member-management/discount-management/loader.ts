import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";

export const appUserDiscountSchema = z.array(
  z.object({
    id: z.string(),
    appUserType: z.string(),
    discount: z.string(),
  }),
);

export const appUserDiscountQuery = {
  queryKey: ["appUser", "discount"],
  queryFn: async () => {
    const response = await privateFetch(`/app-users/app-user-discount`);
    const data = await response.json();

    return appUserDiscountSchema.parse(data);
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(appUserDiscountQuery);
}
