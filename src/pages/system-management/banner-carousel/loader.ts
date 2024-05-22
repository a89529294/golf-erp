import { queryClient } from "@/utils/query-client";
import { privateFetch } from "@/utils/utils";

export const bannerQuery = {
  queryKey: ["banners"],
  queryFn: async () => {
    const response = await privateFetch("/erp-features/banner");
    const data = (await response.json()) as { id: string; name: string }[];
    const ids = data.map((d) => ({ id: d.id, name: d.name }));

    const promises: Promise<Response>[] = [];

    ids.forEach((id) => promises.push(privateFetch(`/file/download/${id.id}`)));

    const preImages = await Promise.all(promises);

    const promises2: Promise<Blob>[] = [];
    preImages.forEach((response) => promises2.push(response.blob()));

    const images = await Promise.all(promises2);

    return images.map((blob, idx) => ({
      id: ids[idx].id,
      name: ids[idx].name,
      data: URL.createObjectURL(blob),
    }));
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(bannerQuery);
}
