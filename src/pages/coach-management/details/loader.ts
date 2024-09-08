import pfp from "@/assets/sample-pfp.jpeg";
import { coachSchema } from "@/pages/coach-management/loader";
import { fromImageIdsToSrc } from "@/utils";
import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";
// import { privateFetch } from "@/utils/utils";

const coachDetailsSchema = coachSchema
  .extend({
    resumes: z.array(z.string()),
    certificates: z.array(z.string()),
    educatePlan: z.string().transform((v) => {
      return JSON.parse(v) as {
        subtitle: string;
        class: { title: string; content: string }[];
      }[];
    }),
    openTimes: z
      .array(
        z.object({
          day: z.number(),
          times: z.array(
            z.object({
              startTime: z.string(),
              endTime: z.string(),
            }),
          ),
        }),
      )
      .nullable(),
  })
  .transform(async (coach) => {
    const avatarSrc = await fromImageIdsToSrc(
      [coach.avatarFileId ?? ""],
      "/coach/image/",
      pfp,
    );

    const resumesSrc = await fromImageIdsToSrc(coach.resumes, "/coach/image/");
    const certificatesSrc = await fromImageIdsToSrc(
      coach.certificates,
      "/coach/image/",
    );

    return {
      ...coach,
      avatarSrc: avatarSrc[0],
      resumesSrc,
      certificatesSrc,
    };
  });

export type CoachDetails = z.infer<typeof coachDetailsSchema>;

export const genCoachDetailsQuery = (coachId: string) => ({
  queryKey: ["coach", coachId],
  queryFn: async () => {
    const response = await privateFetch(`/coach/${coachId}`);
    return coachDetailsSchema.parseAsync(await response.json());
  },
  enabled: !!coachId,
});

export async function loader({ params }: LoaderFunctionArgs) {
  const coachId = params.coachId!;
  return await queryClient.ensureQueryData(genCoachDetailsQuery(coachId));
}
