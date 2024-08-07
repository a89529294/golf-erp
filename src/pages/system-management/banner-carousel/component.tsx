import plusIcon from "@/assets/plus-icon.svg";
import { button } from "@/components/ui/button-cn";
import { MainLayout } from "@/layouts/main-layout";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import redXIcon from "@/assets/red-x-icon.svg";
import { useLoaderData } from "react-router-dom";
import { bannerQuery, loader } from "./loader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { fromImageIdsToSrc } from "@/utils";

type TData = Awaited<ReturnType<typeof loader>>;
export function Component() {
  const queryClient = useQueryClient();
  const initialData = useLoaderData() as TData;
  const { data } = useQuery({
    ...bannerQuery,
    initialData,
  });
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const { mutate: addBanners, isPending: isAdding } = useMutation<
    unknown,
    Error,
    File[]
  >({
    mutationKey: ["add-banner-images"],
    mutationFn: async (files) => {
      const promises: Promise<Response>[] = [];
      files.forEach((file) => {
        const formData = new FormData();
        formData.append("image", file);
        promises.push(
          privateFetch("/erp-features/banner", {
            method: "POST",
            body: formData,
          }),
        );
      });
      return await Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("新增圖片成功");
      queryClient.invalidateQueries({ queryKey: bannerQuery.queryKey });
    },
  });
  const { mutate: deleteBanner, isPending: isDeleting } = useMutation<
    unknown,
    Error,
    string
  >({
    mutationKey: ["delete-banner"],
    mutationFn: async (name) => {
      const response = await privateFetch(`/file/banner/${name}`, {
        method: "DELETE",
      });
      return response;
    },
    onSuccess() {
      toast.success("成功刪除圖片");
      queryClient.invalidateQueries({ queryKey: bannerQuery.queryKey });
    },
  });

  const onUploadBanners: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const imageArray = e.target.files ? Array.from(e.target.files) : [];
    addBanners(imageArray);
  };

  const onRemoveBanner = (name: string) => {
    deleteBanner(name);
  };

  useEffect(() => {
    if (data) {
      fromImageIdsToSrc(data.map((d) => d.id)).then((srcArray) =>
        setImageSrcs(srcArray),
      );
    }
  }, [data]);

  const isPending = isAdding || isDeleting;
  return (
    <MainLayout>
      <div className="mb-2.5 flex-1 border border-line-gray bg-light-gray">
        <div className="p-5 sm:p-1">
          <header className="flex justify-between py-4 pl-5 sm:pr-5">
            <h1 className="font-medium">輪播圖設定</h1>
            <label
              className={cn(
                button({ size: "short" }),
                isPending && "opacity-50",
                "cursor-pointer",
              )}
            >
              <input
                type="file"
                className="hidden"
                multiple
                onChange={onUploadBanners}
                accept="image/*"
                disabled={isPending}
              />
              <img src={plusIcon} />
              新增圖片
            </label>
          </header>

          <ul className="relative grid auto-rows-[160px] grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5 border-t border-line-gray bg-white p-5">
            {data.map((img, idx) => (
              <li
                className={cn("relative", isPending && "opacity-50")}
                key={img.id}
              >
                <img
                  src={imageSrcs[idx]}
                  className="object-contain w-full h-full border border-line-gray"
                />
                <button
                  className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white border rounded-full border-line-red"
                  onClick={() => onRemoveBanner(img.name)}
                >
                  <img src={redXIcon} />
                </button>
              </li>
            ))}
            {data.length === 0 && (
              <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 text-word-gray">
                尚未新增圖片
              </div>
            )}
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
