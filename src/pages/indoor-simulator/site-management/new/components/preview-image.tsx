import { ExistingImg, FileWithId } from "../schemas";
import React from "react";
import redXIcon from "@/assets/red-x-icon.svg";
import { cn } from "@/lib/utils";

export function PreviewImage({
  file,
  onRemoveImage,
  disabled,
}: {
  file: FileWithId | ExistingImg;
  onRemoveImage: (id: string) => void;
  disabled?: boolean;
}) {
  const [imgSrc, setImgSrc] = React.useState(() =>
    "src" in file ? file.src : "",
  );

  React.useEffect(() => {
    if ("src" in file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = (e) => {
      console.log(e.target?.result);
      setImgSrc((e.target?.result ?? "") as string);
    };
  }, [file]);

  return (
    <div className={cn("group relative h-32 w-32", disabled && "opacity-50")}>
      <button
        type="button"
        className={cn(
          "absolute right-0 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line-red ",
          !disabled && "group-hover:block",
        )}
        onClick={() => !disabled && onRemoveImage(file.id)}
      >
        <img src={redXIcon} />
      </button>
      <img src={imgSrc} className="h-full w-full object-contain" />
    </div>
  );
}
