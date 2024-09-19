import pfp from "@/assets/pfp-icon.svg";
import { base_url } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { z } from "zod";
// import { privateFetch } from "@/utils/utils";
// import { z } from "zod";

export const coachSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  status: z
    .enum(["pending", "pass", "decline"])
    .transform((v) =>
      v === "pending" ? "審核中" : v === "pass" ? "審核成功" : "審核失敗",
    ),
  avatarFileId: z.string().nullable(),
});

// const coachesSchema = z.object({
//   data: z.array(
//     coachSchema.transform(async (coach) => {
//       const avatarSrc = await fromImageIdsToSrc(
//         [coach.avatarFileId ?? ""],
//         "/coach/image/",
//         pfp,
//       );

//       return {
//         ...coach,
//         avatarSrc: avatarSrc[0],
//       };
//     }),
//   ),
// });

const coachesSchema = z.object({
  data: z.array(
    coachSchema.transform((v) => ({
      ...v,
      avatarURI: v.avatarFileId
        ? `${base_url}/coach/image/${v.avatarFileId}`
        : pfp,
    })),
  ),
});

export type Coach = z.infer<typeof coachesSchema>["data"][number];

export const coachesQuery = {
  queryKey: ["coaches"],
  queryFn: async () => {
    const response = await privateFetch("/coach?pageSize=999");

    const parsedData = (await coachesSchema.parseAsync(await response.json()))
      .data;

    return parsedData;
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(coachesQuery);
}
