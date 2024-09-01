import { queryClient } from "@/utils/query-client.ts";
import { privateFetch } from "@/utils/utils.ts";
import { equipmentSchema } from "@/utils/category/schemas.ts";
import { z } from "zod";

export type Equipment = z.infer<typeof equipmentSchema>;

export const equipmentsQuery = {
  queryKey: ["equipments"],
  queryFn: async () => {
    const response = await privateFetch("/equipment");

    const data = await response.json();

    const parsed = z.array(equipmentSchema).parse(data);

    return parsed;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(equipmentsQuery);
}
