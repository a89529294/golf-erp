import { XMLParser } from "fast-xml-parser";
import { z } from "zod";

const countiesSchema = z.object({
  countyItems: z.object({
    countyItem: z.array(
      z.object({ countycode: z.string(), countyname: z.string() }),
    ),
  }),
});

const districtsSchema = z.object({
  townItems: z.object({
    townItem: z.array(z.object({ townname: z.string() })),
  }),
});

export const countyQuery = {
  queryKey: ["counties"],
  queryFn: async () => {
    const response = await fetch("https://api.nlsc.gov.tw/other/ListCounty");

    const rawXML = await response.text();
    const parsed = new XMLParser().parse(rawXML);
    const validCounties = countiesSchema.parse(parsed);
    return validCounties.countyItems.countyItem;
  },
};

export const generateDistrictQuery = (countyCode: string) => ({
  queryKey: [countyCode, "districts"],
  queryFn: async () => {
    const response = await fetch(
      `https://api.nlsc.gov.tw/other/ListTown1/${countyCode}`,
    );

    const rawXML = await response.text();
    const parsed = new XMLParser().parse(rawXML);
    const validDistricts = districtsSchema.parse(parsed);
    return validDistricts.townItems.townItem;
  },
});
