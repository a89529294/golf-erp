import { Modal } from "@/components/modal";
import backIcon from "@/assets/back.svg";
import { useNavigate } from "react-router-dom";
import saveIcon from "@/assets/save.svg";

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
            <button disabled={isMutating} className="flex gap-1">
              <img src={backIcon} />
              返回
            </button>
          }
          onSubmit={() => navigate(-1)}
          title="資料尚未儲存，是否返回列表？"
        />
      ) : (
        <button
          disabled={isMutating}
          className="flex gap-1"
          onClick={() => navigate(-1)}
        >
          <img src={backIcon} />
          返回
        </button>
      )}
      <button disabled={isMutating} className="flex gap-1" form="store-form">
        <img src={saveIcon} />
        儲存
      </button>
    </>
  );
}
