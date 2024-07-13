import backIcon from "@/assets/back.svg";
import { IconButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { cn } from "@/lib/utils";
import { linksKV } from "@/utils/links";
import { Link } from "react-router-dom";

export function NewFormDesktopMenubar({ isPending }: { isPending: boolean }) {
  return (
    <>
      <Link
        className={cn(
          button(),
          isPending ? "cursor-not-allowed opacity-50" : "",
        )}
        to={
          isPending
            ? window.location.pathname
            : linksKV["member-management"].paths["index"]
        }
      >
        <img src={backIcon} />
        返回
      </Link>

      <IconButton
        icon="save"
        type="submit"
        form="member-form"
        disabled={isPending}
      >
        儲存
      </IconButton>
    </>
  );
}
