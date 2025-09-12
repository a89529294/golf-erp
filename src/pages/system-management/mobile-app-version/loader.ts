import { queryOptions } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { queryClient } from "@/utils/query-client";

export type MobileAppVersion = {
  id: string;
  platform: "ios" | "android";
  version: string;
  createdAt: string;
  updatedAt: string;
};

export const mobileAppVersionQuery = {
  queryKey: ["mobile-app-version"],
  queryFn: async (): Promise<MobileAppVersion[]> => {
    const response = await privateFetch(`/mobile-app-version`);
    if (!response.ok) {
      throw new Error("Failed to fetch mobile app versions");
    }
    return response.json();
  },
};

export async function loader() {
  return await queryClient.ensureQueryData(mobileAppVersionQuery);
}
