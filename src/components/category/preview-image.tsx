import React from "react";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";
import { FileWithId, ExistingImg } from "@/utils/category/schemas";
import { fromImageIdsToSrc } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PreviewImage({
  file,
  onRemoveImage,
  disabled,
}: {
  file: FileWithId | ExistingImg;
  onRemoveImage: (id: string) => void;
  disabled?: boolean;
}) {
  const [imgSrc, setImgSrc] = React.useState("");

  React.useEffect(() => {
    if ("src" in file) {
      fromImageIdsToSrc([file.src]).then((v) => setImgSrc(v[0]));
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file.file);
      reader.onload = (e) => {
        setImgSrc((e.target?.result ?? "") as string);
      };
    }
  }, [file]);

  return (
    <div className={cn("group relative h-32 w-32", disabled && "opacity-50")}>
      <button
        type="button"
        className={cn(
          "absolute right-0 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line-red ",
          !disabled && "group-hover:block",
        )}
        onClick={() => {
          console.log(file.id);
          !disabled && onRemoveImage(file.id);
        }}
      >
        <img src={redXIcon} />
      </button>
      {imgSrc === "" ? (
        <Skeleton className="h-full w-full rounded-none bg-[#c1c1c1]" />
      ) : (
        <img src={imgSrc} className="h-full w-full object-contain" />
      )}
    </div>
  );
}
