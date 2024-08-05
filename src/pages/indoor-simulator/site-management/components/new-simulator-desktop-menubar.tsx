import { IconButton } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NewSimulatorDesktopMenubar({
  isPending,
}: {
  isPending: boolean;
}) {
  const navigate = useNavigate();

  return (
    <>
      <IconButton disabled={isPending} icon="back" onClick={() => navigate(-1)}>
        返回
      </IconButton>
      <IconButton disabled={isPending} icon="save" form="site-details">
        儲存
      </IconButton>
    </>
  );
}
