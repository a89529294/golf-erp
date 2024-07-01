import { Skeleton } from "@/components/ui/skeleton";
import { fromImageIdsToSrc } from "@/utils";
import React from "react";

export function ImagesContainer({ imageIds }: { imageIds: string[] }) {
  const [imageSrcs, setImageSrcs] = React.useState<string[]>([]);

  React.useEffect(() => {
    (async () => {
      const arr = await fromImageIdsToSrc(imageIds);
      setImageSrcs(arr);
    })();
  }, [imageIds]);

  return (
    <div className="grid auto-rows-[75px] grid-cols-[repeat(3,95px)] place-items-center gap-2.5">
      {imageIds.length
        ? imageSrcs.length
          ? imageSrcs.map((src, i) => (
              <img key={i} src={src} className="h-full object-contain" />
            ))
          : imageIds.map((_, i) => (
              <Skeleton key={i} className="h-full w-full" />
            ))
        : null}
    </div>
  );
}
