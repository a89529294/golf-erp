import { cn } from "@/lib/utils";
import { formSchema } from "@/pages/store-management/schemas";
import { getBase64 } from "@/utils";
import { privateFetch } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import trashCan from "@/assets/trash-can-icon.svg";

export function ChargeImageField({
  form,
  disabled,
  setChargeImageId,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>, unknown, undefined>;
  disabled: boolean;
  setChargeImageId?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { register, setValue, getValues } = form;
  const { onChange, ref } = register("chargeImages");
  const [image, setImage] = useState("");
  const chargeImages = getValues("chargeImages");

  const onImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        const base64 = await getBase64(event.target.files[0]);

        setImage(base64);
        if (setChargeImageId && typeof chargeImages === "string")
          setChargeImageId(chargeImages);
        onChange(event);
      }
    },
    [onChange, setChargeImageId, chargeImages],
  );

  useEffect(() => {
    console.log(chargeImages);
    if (typeof chargeImages === "string" && chargeImages) {
      (async () => {
        const response = await privateFetch(
          `/store/charge-image/${chargeImages}`,
          {
            credentials: "include",
          },
        );

        // Convert the response to a Blob
        const blob = await response.blob();

        // Create an object URL for the Blob
        const imageUrl = URL.createObjectURL(blob);

        setImage(imageUrl);
      })();
    }
  }, [chargeImages]);

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_1fr] items-center gap-y-1 sm:grid-cols-1",
      )}
    >
      <div className="w-28">儲值優惠圖片</div>
      <div
        className={cn(
          "flex items-center gap-2",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <label className="rounded-md border border-line-gray px-2 py-1">
          <input
            type="file"
            name="chargeImages"
            ref={ref}
            onChange={onImageChange}
            className="hidden"
            disabled={disabled}
            accept="image/*"
          />
          上傳圖片
        </label>
        {image && (
          <div className="relative size-14">
            <img src={image} className="h-full w-full object-contain" />
            <button
              className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
              onClick={() => {
                if (typeof chargeImages === "string" && setChargeImageId)
                  setChargeImageId(chargeImages);
                setValue("chargeImages", null, { shouldDirty: true });
                setImage("");
              }}
              disabled={disabled}
            >
              <img src={trashCan} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
