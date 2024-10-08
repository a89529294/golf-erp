import { IconButton, IconWarningButton } from "@/components/ui/button";

export function DesktopMenubar({
  isPending,
  isEditing,
  startEdit,
  cancelEdit,
}: {
  isPending: boolean;
  isEditing: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
}) {
  return isEditing ? (
    <>
      <IconWarningButton
        icon="redX"
        type="button"
        onClick={cancelEdit}
        form="discount-form"
        disabled={isPending}
      >
        取消編輯
      </IconWarningButton>

      <IconButton
        icon="save"
        type="submit"
        form="discount-form"
        disabled={isPending}
      >
        儲存
      </IconButton>
    </>
  ) : (
    <IconButton
      icon="pencil"
      type="button"
      form="discount-form"
      onClick={startEdit}
      disabled={isPending}
    >
      編輯
    </IconButton>
  );
}
