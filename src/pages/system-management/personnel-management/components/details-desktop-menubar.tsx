import { Modal } from "@/components/modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function DetailsDesktopMenubar({
  isBasicInfoDirty,
  isCategoryStoreDirty,
  isMutating,
  setDisabled,
  disabled,
  onSubmit,
  onDeleteEmployee,
  employeeName,
}: {
  isBasicInfoDirty?: boolean;
  isCategoryStoreDirty?: boolean;
  isMutating: boolean;
  setDisabled: (arg: boolean) => void;
  disabled: boolean;
  onSubmit: () => void;
  onDeleteEmployee: () => void;
  employeeName: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      {isBasicInfoDirty || isCategoryStoreDirty ? (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton icon="redX" disabled={isMutating}>
              取消編輯
            </IconWarningButton>
          }
          onSubmit={onSubmit}
        >
          資料尚未儲存，是否返回？
        </Modal>
      ) : disabled ? (
        <IconButton
          disabled={isMutating}
          icon="back"
          onClick={() => navigate("/system-management/personnel-management")}
        >
          返回
        </IconButton>
      ) : (
        <IconWarningButton icon="redX" onClick={() => setDisabled(true)}>
          取消編輯
        </IconWarningButton>
      )}
      {disabled ? (
        <>
          <Modal
            dialogTriggerChildren={
              <IconWarningButton icon="redX">刪除</IconWarningButton>
            }
            onSubmit={onDeleteEmployee}
          >
            確認刪除{employeeName}?
          </Modal>
          <IconButton
            type="button"
            icon="pencil"
            onClick={(e) => {
              // necessary to prevent the save button from firing
              e.nativeEvent.stopImmediatePropagation();
              setTimeout(() => {
                setDisabled(false);
              }, 0);
            }}
            // key="edit-btn"
          >
            編輯
          </IconButton>
        </>
      ) : (
        <IconButton
          disabled={isMutating || !(isBasicInfoDirty || isCategoryStoreDirty)}
          icon="save"
          form="new-employee-form"
        >
          儲存
        </IconButton>
      )}
    </>
  );
}
