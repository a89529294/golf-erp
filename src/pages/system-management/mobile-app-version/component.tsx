import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { privateFetch } from "@/utils/utils";
import { IconShortButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/layouts/main-layout";
import { toast } from "sonner";
import { mobileAppVersionQuery, MobileAppVersion } from "./loader";

const updateMobileAppVersion = async ({
  id,
  version,
  platform,
}: {
  id: string;
  version: string;
  platform: string;
}): Promise<MobileAppVersion> => {
  const response = await privateFetch(`/mobile-app-version/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ version, platform }),
  });

  if (!response.ok) {
    throw new Error("Failed to update mobile app version");
  }

  return response.json();
};

export const Component = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof mobileAppVersionQuery.queryFn>
  >;
  const queryClient = useQueryClient();

  const { data: versions } = useQuery({
    ...mobileAppVersionQuery,
    initialData,
  });

  const [iosVersion, setIosVersion] = useState("");
  const [androidVersion, setAndroidVersion] = useState("");

  React.useEffect(() => {
    if (versions) {
      const ios = versions.find((v) => v.platform === "ios");
      const android = versions.find((v) => v.platform === "android");
      setIosVersion(ios?.version || "");
      setAndroidVersion(android?.version || "");
    }
  }, [versions]);

  const iosUpdateMutation = useMutation({
    mutationFn: updateMobileAppVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app-version"] });
      toast.success("iOS 版本更新成功");
    },
    onError: (error) => {
      toast.error(`iOS 更新失敗: ${error.message}`);
    },
  });

  const androidUpdateMutation = useMutation({
    mutationFn: updateMobileAppVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app-version"] });
      toast.success("Android 版本更新成功");
    },
    onError: (error) => {
      toast.error(`Android 更新失敗: ${error.message}`);
    },
  });

  const handleUpdate = async (platform: "ios" | "android", version: string) => {
    const versionData = versions?.find((v) => v.platform === platform);
    if (!versionData) {
      toast.error("找不到對應的平台版本資料");
      return;
    }

    if (!version.trim()) {
      toast.error("版本號不能為空");
      return;
    }

    const mutation = platform === "ios" ? iosUpdateMutation : androidUpdateMutation;
    mutation.mutate({
      id: versionData.id,
      version: version.trim(),
      platform,
    });
  };

  console.log(versions);
  const iosVersionData = versions?.find((v) => v.platform === "ios");
  const androidVersionData = versions?.find((v) => v.platform === "android");

  console.log(versions);

  return (
    <MainLayout>
      {({ height }) => (
        <div className="p-5">
          <div className="mb-6">
            <h1 className="text-primary-dark text-2xl font-bold">
              APP版本管理
            </h1>
          </div>

          <div className="flex gap-2">
            {/* iOS Version */}
            <div className="rounded-lg border border-line-gray bg-white p-5">
              <h2 className="text-primary-dark mb-4 text-lg font-semibold">
                iOS 版本
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-primary-dark mb-2 block text-sm font-medium">
                    版本號
                  </label>
                  <Input
                    value={iosVersion}
                    onChange={(e) => setIosVersion(e.target.value)}
                    placeholder="例如: 1.2.3"
                    disabled={iosUpdateMutation.isPending}
                    className="w-full"
                  />
                </div>

                <IconShortButton
                  icon="save"
                  onClick={() => handleUpdate("ios", iosVersion)}
                  disabled={
                    iosUpdateMutation.isPending ||
                    iosVersion === iosVersionData?.version
                  }
                  className="w-full"
                >
                  {iosUpdateMutation.isPending ? "更新中..." : "更新 iOS 版本"}
                </IconShortButton>
              </div>
            </div>

            {/* Android Version */}
            <div className="rounded-lg border border-line-gray bg-white p-5">
              <h2 className="text-primary-dark mb-4 text-lg font-semibold">
                Android 版本
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-primary-dark mb-2 block text-sm font-medium">
                    版本號
                  </label>
                  <Input
                    value={androidVersion}
                    onChange={(e) => setAndroidVersion(e.target.value)}
                    placeholder="例如: 1.2.3"
                    disabled={androidUpdateMutation.isPending}
                    className="w-full"
                  />
                </div>

                <IconShortButton
                  icon="save"
                  onClick={() => handleUpdate("android", androidVersion)}
                  disabled={
                    androidUpdateMutation.isPending ||
                    androidVersion === androidVersionData?.version
                  }
                  className="w-full"
                >
                  {androidUpdateMutation.isPending ? "更新中..." : "更新 Android 版本"}
                </IconShortButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
