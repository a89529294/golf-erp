import { ImagePortalContainer } from "@/components/image-portal-container";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fromImageIdsToSrc } from "@/utils";
import React from "react";
import { createPortal } from "react-dom";

export function ImagesContainer({ imageIds }: { imageIds: string[] }) {
  const [imageSrcs, setImageSrcs] = React.useState<string[]>([]);
  const [displayImgIdx, setDisplayImgIdx] = React.useState(0);
  const [showImagePortal, setShowImagePortal] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setShowImagePortal(false);
    });
  }, []);

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
          <button onClick={() => setShowImagePortal(true)}>
            <img
              src={imageSrcs[displayImgIdx]}
              className="mx-auto h-full w-16 shrink-0 object-contain"
            />
          </button>
        ) : (
          <Skeleton className="mx-auto h-full w-16 shrink-0" />
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
      {showImagePortal &&
        createPortal(
          <ImagePortalContainer
            src={imageSrcs[displayImgIdx]}
            onClose={() => setShowImagePortal(false)}
          />,
          document.querySelector("#image-root")!,
        )}
    </div>
  );
}
