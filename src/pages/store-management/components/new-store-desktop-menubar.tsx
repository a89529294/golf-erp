import { Modal } from "@/components/modal";
import { IconButton } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NewStoreDesktopMenubar({
  isDirty,
  isMutating,
}: {
  isDirty: boolean;
  isMutating: boolean;
}) {
  const navigate = useNavigate();

  return (
    <>
      {isDirty ? (
        <Modal
          dialogTriggerChildren={
            <IconButton disabled={isMutating} icon="back">
              返回
            </IconButton>
          }
          onSubmit={() => navigate(-1)}
          title="資料尚未儲存，是否返回列表？"
        />
      ) : (
        <IconButton
          disabled={isMutating}
          onClick={() => navigate(-1)}
          icon="back"
        >
          返回
        </IconButton>
      )}
      <IconButton disabled={isMutating} icon="save" form="store-form">
        儲存
      </IconButton>
    </>
  );
}
