import pfp from "@/assets/sample-pfp.jpeg";
import { queryClient } from "@/utils/query-client";
import { LoaderFunctionArgs } from "react-router-dom";
import { z } from "zod";
// import { privateFetch } from "@/utils/utils";

const coachDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]),
  pfp: z.string(),
  qualifications: z.array(z.string()),
  certificates: z.array(z.string()),
  lessonPlans: z.array(
    z.object({
      title: z.string(),
      details: z.array(
        z.object({
          orderName: z.string(),
          title: z.string(),
          content: z.string(),
        }),
      ),
    }),
  ),
  availability: z.object({
    monday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    tuesday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    wednesday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    thursday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    friday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    saturday: z.object({
      start: z.string(),
      end: z.string(),
    }),
    sunday: z.object({
      start: z.string(),
      end: z.string(),
    }),
  }),
});

export type CoachDetails = z.infer<typeof coachDetailsSchema>;

export const genCoachDetailsQuery = (coachId: string) => ({
  queryKey: ["coach", coachId],
  queryFn: async () => {
    //   const response = await privateFetch(
    //     "/store?pageSize=99&populate=employees",
    //   );

    //   const data = await response.json();

    //   const parsed = coachesSchema.parse(data).data;

    //   const x = {
    //     golf: parsed.filter((s) => s.category === "golf"),
    //     ground: parsed.filter((s) => s.category === "ground"),
    //     simulator: parsed.filter((s) => s.category === "simulator"),
    //   };

    //   return x;
    return {
      id: "1",
      name: "A",
      phone: "0998786373",
      verificationStatus: "pending",
      pfp,
      qualifications: [pfp, pfp, pfp, pfp, pfp, pfp, pfp, pfp, pfp, pfp],
      certificates: [pfp],
      lessonPlans: [
        {
          title: "新手計畫",
          details: [
            {
              orderName: "第一節",
              title: "標題",
              content: "內容",
            },
          ],
        },
      ],
      availability: {
        monday: {
          start: "7:00",
          end: "15:00",
        },
        tuesday: {
          start: "7:00",
          end: "15:00",
        },
        wednesday: {
          start: "7:00",
          end: "15:00",
        },
        thursday: {
          start: "7:00",
          end: "15:00",
        },
        friday: {
          start: "7:00",
          end: "15:00",
        },
        saturday: {
          start: "7:00",
          end: "15:00",
        },
        sunday: {
          start: "7:00",
          end: "15:00",
        },
      },
    } as CoachDetails;
  },
});

export async function loader({ params }: LoaderFunctionArgs) {
  const coachId = params.coachId!;
  return await queryClient.ensureQueryData(genCoachDetailsQuery(coachId));
}
