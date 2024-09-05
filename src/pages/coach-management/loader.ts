import pfp from "@/assets/sample-pfp.jpeg";
import { queryClient } from "@/utils/query-client";
import { z } from "zod";
// import { privateFetch } from "@/utils/utils";
// import { z } from "zod";

const coachSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]),
  pfp: z.string(),
});

export type Coach = z.infer<typeof coachSchema>;
// const coachesSchema = z.object({
//     data: z.array(coachSchema)
// })

export const coachesQuery = {
  queryKey: ["coaches"],
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
    return [
      {
        id: "1",
        name: "A",
        phone: "0999123321",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "2",
        name: "B",
        phone: "0939481929",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "3",
        name: "C",
        phone: "0219384859",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "4",
        name: "D",
        phone: "0987654321",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "5",
        name: "E",
        phone: "0912345678",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "6",
        name: "F",
        phone: "0923456789",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "7",
        name: "G",
        phone: "0934567890",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "8",
        name: "H",
        phone: "0945678901",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "9",
        name: "I",
        phone: "0956789012",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "10",
        name: "J",
        phone: "0967890123",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "11",
        name: "K",
        phone: "0978901234",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "12",
        name: "L",
        phone: "0989012345",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "13",
        name: "M",
        phone: "0990123456",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "14",
        name: "N",
        phone: "0901234567",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "15",
        name: "O",
        phone: "0912345670",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "16",
        name: "P",
        phone: "0923456701",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "17",
        name: "Q",
        phone: "0934567012",
        verificationStatus: "verified",
        pfp,
      },
      {
        id: "18",
        name: "R",
        phone: "0945670123",
        verificationStatus: "rejected",
        pfp,
      },
      {
        id: "19",
        name: "S",
        phone: "0956701234",
        verificationStatus: "pending",
        pfp,
      },
      {
        id: "20",
        name: "T",
        phone: "0967012345",
        verificationStatus: "verified",
        pfp,
      },
    ] as Coach[];
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(coachesQuery);
}
