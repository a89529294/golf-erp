import { Modal } from "@/components/modal";
import { TabletSendPoints } from "@/components/tablet";
import { Input } from "@/components/ui/input";
import { privateFetch } from "@/utils/utils";
import { useState } from "react";
import { toast } from "sonner";

export function AddCoinModal({
  appUserId,
  storeId,
}: {
  appUserId: string;
  storeId: string;
}) {
  const [amount, setAmount] = useState<number | "">("");

  return (
    <Modal
      dialogTriggerChildren={<TabletSendPoints />}
      onSubmit={async () => {
        try {
          await privateFetch(`/app-users/${appUserId}/add-coin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coin: amount,
              storeId: storeId,
            }),
          });
          toast.success("贈送點數成功");
        } catch (e) {
          console.log(e);
          toast.error("贈送點數失敗");
        }
      }}
    >
      <div>
        <h1 className="mb-1 text-center">數入點數</h1>
        <Input
          className="rounded-none border-0 border-b border-b-secondary-dark text-center"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(+e.target.value);
          }}
        />
      </div>
    </Modal>
  );
}
