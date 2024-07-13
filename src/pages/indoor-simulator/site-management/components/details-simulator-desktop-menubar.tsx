import { Modal } from "@/components/modal";
import { IconButton, IconWarningButton } from "@/components/ui/button";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function DetailsSimulatorDesktopMenubar<T extends FieldValues>({
  formDisabled,
  setFormDisabled,
  isPending,
  form,
  onReset,
  deleteModalTitle,
  deleteSite,
}: {
  formDisabled: boolean;
  setFormDisabled: (arg: boolean) => void;
  isPending: boolean;
  form: UseFormReturn<T>;
  onReset: () => void;
  deleteModalTitle: string;
  deleteSite: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      {formDisabled ? (
        <IconButton icon="back" onClick={() => navigate(-1)}>
          返回
        </IconButton>
      ) : Object.keys(form.formState.dirtyFields).length !== 0 ? (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton disabled={isPending} icon="redX">
              取消編輯
            </IconWarningButton>
          }
          onSubmit={onReset}
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
            <IconWarningButton icon="trashCan" disabled={isPending}>
              刪除
            </IconWarningButton>
          }
          title={deleteModalTitle}
          onSubmit={deleteSite}
        ></Modal>
      )}
      {formDisabled ? (
        <IconButton
          icon="pencil"
          type="button"
          onClick={() => setTimeout(() => setFormDisabled(false), 0)}
        >
          編輯
        </IconButton>
      ) : (
        <IconButton
          disabled={isPending || !form.formState.isDirty}
          icon="save"
          type="submit"
          form="site-details"
        >
          儲存
        </IconButton>
      )}
    </>
  );
}
