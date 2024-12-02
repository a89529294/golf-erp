import { Modal } from "@/components/modal";
import { TabletDeleteMember } from "@/components/tablet";

import { privateFetch } from "@/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteMemberModal({
  userId,
  userName,
  category,
}: {
  userId: string;
  userName: string;
  category?: string;
}) {
  const queryClient = useQueryClient();

  return (
    <Modal
      className="flex h-[200px] w-[400px] flex-col"
      dialogTriggerChildren={<TabletDeleteMember />}
      onSubmit={async () => {
        try {
          await privateFetch(`/app-users/${userId}`, {
            method: "DELETE",
          });

          toast.success("刪除會員成功");
          queryClient.invalidateQueries({ queryKey: ["members"] });

          if (category)
            queryClient.invalidateQueries({ queryKey: [category, "members"] });
        } catch (e) {
          console.log(e);
          toast.error("刪除會員失敗");
        }
      }}
      headerClassName="self-stretch justify-center"
    >
      <div className="flex h-full w-full flex-col items-center justify-center ">
        是否刪除會員 {userName} ?
      </div>
    </Modal>
  );
}
