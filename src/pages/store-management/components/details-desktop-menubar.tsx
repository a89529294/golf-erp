import { Modal } from "@/components/modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function DetailsDesktopMenubar<T extends FieldValues>({
  disabled,
  form,
  isMutating,
  setDisabled,
  onSubmit,
  storeName,
}: {
  disabled: boolean;
  form: UseFormReturn<T>;
  isMutating: boolean;
  setDisabled: (arg: boolean) => void;
  onSubmit: () => Promise<void>;
  storeName: string;
}) {
  const navigate = useNavigate();

  return (
    <>
      {disabled ? (
        <IconButton
          icon="back"
          onClick={() => navigate("/store-management?category=all")}
        >
          返回
        </IconButton>
      ) : Object.keys(form.formState.dirtyFields).length !== 0 ? (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton disabled={isMutating} icon="redX">
              取消編輯
            </IconWarningButton>
          }
          onSubmit={() => {
            setDisabled(true);
            form.reset();
          }}
        >
          資料尚未儲存，是否返回？
        </Modal>
      ) : (
        <IconWarningButton icon="redX" onClick={() => setDisabled(true)}>
          取消編輯
        </IconWarningButton>
      )}

      {disabled ? (
        <>
          <Modal
            dialogTriggerChildren={
              <IconWarningButton
                disabled={isMutating}
                icon="trashCan"
                type="button"
              >
                刪除
              </IconWarningButton>
            }
            onSubmit={onSubmit}
            title={`是否刪除${storeName}`}
          />
          <IconButton
            icon="save"
            type="button"
            onClick={() => {
              setTimeout(() => {
                setDisabled(false);
              }, 0);
            }}
          >
            編輯
          </IconButton>
        </>
      ) : (
        <IconButton
          disabled={isMutating || !form.formState.isDirty}
          icon="save"
          form="store-form"
          type="submit"
        >
          儲存
        </IconButton>
      )}
    </>
  );
}
