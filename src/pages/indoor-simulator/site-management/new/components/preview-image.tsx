import { FileWithId } from "../schemas";
import React from "react";
import redXIcon from "@/assets/red-x-icon.svg";

export function PreviewImage({
  file,
  onRemoveImage,
}: {
  file: FileWithId;
  onRemoveImage: (id: string) => void;
}) {
  const [imgSrc, setImgSrc] = React.useState("");

  React.useEffect(() => {
    const reader = new FileReader();
    reader.readAsDataURL(file.file);
    reader.onload = (e) => {
      setImgSrc((e.target?.result ?? "") as string);
    };
  }, [file]);

  return (
    <div className="group relative h-32 w-32">
      <button
        type="button"
        className="absolute right-0 top-0 hidden h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full border border-line-red group-hover:block"
        onClick={() => onRemoveImage(file.id)}
      >
        <img src={redXIcon} />
      </button>
      <img src={imgSrc} className="h-full w-full  object-contain" />
    </div>
  );
}
