import { IconButton } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NewSiteDesktopMenubar({ isPending }: { isPending: boolean }) {
  const navigate = useNavigate();
  return (
    <>
      <IconButton icon="back" onClick={() => navigate(-1)} disabled={isPending}>
        返回
      </IconButton>
      <IconButton icon="save" form="site-details" disabled={isPending}>
        儲存
      </IconButton>
    </>
  );
}
