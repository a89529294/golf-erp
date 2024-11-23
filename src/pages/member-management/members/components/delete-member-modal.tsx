import { Modal } from "@/components/modal";
import { TabletDeleteMember } from "@/components/tablet";

// import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";

export function DeleteMemberModal({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  return (
    <Modal
      className="flex h-[200px] w-[400px] flex-col"
      dialogTriggerChildren={<TabletDeleteMember />}
      onSubmit={async () => {
        try {
          //   await privateFetch(`/app-users/${userId}/add-coin`, {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       coin: amount,
          //       storeId: storeId,
          //     }),
          //   });
          // TODO: replace with real api
          await new Promise((r) => setTimeout(r, 2000));
          toast.success("刪除會員成功");
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
