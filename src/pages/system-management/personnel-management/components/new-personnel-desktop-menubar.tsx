import { IconButton } from "@/components/ui/button";

import { Modal } from "@/components/modal";
import { useNavigate } from "react-router-dom";

export function NewPersonnelDesktopMenubar({
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
          icon="back"
          onClick={() => navigate(-1)}
        >
          返回
        </IconButton>
      )}
      <IconButton disabled={isMutating} icon="save" form="new-employee-form">
        儲存
      </IconButton>
    </>
  );
}
