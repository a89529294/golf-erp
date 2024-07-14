import { Modal } from "@/components/modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DetailsDesktopMenubar({
  formDisabled,
  isPending,
  dirtyFieldsLength,
  onBackWithoutSave,
  setFormDisabled,
  deleteSite,
  siteName,
}: {
  formDisabled: boolean;
  isPending: boolean;
  dirtyFieldsLength: number;
  onBackWithoutSave: () => void;
  setFormDisabled: (arg: boolean) => void;
  deleteSite: () => void;
  siteName: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      {formDisabled ? (
        <IconButton icon="back" onClick={() => navigate(-1)}>
          返回
        </IconButton>
      ) : dirtyFieldsLength !== 0 ? (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton disabled={isPending} icon="redX">
              取消編輯
            </IconWarningButton>
          }
          onSubmit={onBackWithoutSave}
        >
          資料尚未儲存，是否返回？
        </Modal>
      ) : (
        <IconWarningButton icon="redX" onClick={() => setFormDisabled(true)}>
          取消編輯
        </IconWarningButton>
      )}

      {formDisabled && (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton icon="trashCan">刪除</IconWarningButton>
          }
          onSubmit={deleteSite}
        >
          確認刪除{siteName}?
        </Modal>
      )}

      {formDisabled ? (
        <IconButton
          icon="pencil"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setFormDisabled(false);
          }}
        >
          編輯
        </IconButton>
      ) : (
        <IconButton
          disabled={isPending || dirtyFieldsLength === 0}
          icon="save"
          form="site-details"
          onClick={() => {}}
        >
          儲存
        </IconButton>
      )}
    </>
  );
}
