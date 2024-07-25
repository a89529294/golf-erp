import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fromImageIdsToSrc } from "@/utils";
import React from "react";

export function ImagesContainer({ imageIds }: { imageIds: string[] }) {
  const [imageSrcs, setImageSrcs] = React.useState<string[]>([]);
  const [displayImgIdx, setDisplayImgIdx] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      const arr = await fromImageIdsToSrc(imageIds);
      setImageSrcs(arr);
    })();
  }, [imageIds]);

  function showNextImage() {
    setDisplayImgIdx((prevIdx) => (prevIdx + 1) % imageIds.length);
  }

  function showPrevImage() {
    setDisplayImgIdx(
      (prevIdx) => (prevIdx - 1 + imageIds.length) % imageIds.length,
    );
  }

  return (
    <div className="relative flex h-16 w-20 overflow-hidden">
      <button
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2",
          imageIds.length < 2 && "hidden",
        )}
        onClick={showPrevImage}
      >
        ◀
      </button>
      {imageIds.length ? (
        imageSrcs.length ? (
          <img
            src={imageSrcs[displayImgIdx]}
            className="mx-auto h-full w-16 shrink-0 object-contain"
          />
        ) : (
          imageIds.map((_, i) => <Skeleton key={i} className="h-full w-full" />)
        )
      ) : null}
      <button
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2",
          imageIds.length < 2 && "hidden",
        )}
        onClick={showNextImage}
      >
        ▶
      </button>
    </div>
  );
}
