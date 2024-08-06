import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const bannerQuery = {
  queryKey: ["banners"],
  queryFn: async () => {
    const response = await privateFetch("/erp-features/banner");
    const response2 = response.clone();
    const plainTextData = await response.text();

    let data: {
      id: string;
      name: string;
      createdAt: string;
      uri: string;
    }[];
    if (plainTextData === "") data = [];
    else
      data = (await response2.json()) as {
        id: string;
        name: string;
        createdAt: string;
        uri: string;
      }[];
    data.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return data;
    // const ids = data.map((d) => ({ id: d.id, name: d.name }));

    // const images = await fromImageIdsToSrc(ids.map((v) => v.id));

    // return images.map((tempURL, idx) => ({
    //   id: ids[idx].id,
    //   name: ids[idx].name,
    //   data: tempURL,
    // }));
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(bannerQuery);
}
