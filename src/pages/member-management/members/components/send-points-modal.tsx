import { Modal } from "@/components/modal";
import { TabletSendPoints } from "@/components/tablet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { storesQuery } from "@/pages/store-management/loader";
import { privateFetch } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function SendPointsModal({ userId }: { userId: string }) {
  const [storeId, setStoreId] = useState("");
  const [amount, setAmount] = useState("");
  const { data } = useQuery({
    ...storesQuery,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Modal
      className="flex h-[300px] w-[600px] flex-col"
      dialogTriggerChildren={<TabletSendPoints />}
      onSubmit={async () => {
        if (!amount || !storeId) return;

        try {
          await privateFetch(`/app-users/${userId}/add-coin`, {
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
      headerClassName="self-stretch justify-center"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-5 pt-5">
        <Label className="flex items-baseline gap-5">
          <h2 className="w-[100px]">選擇廠商</h2>
          <Select value={storeId} onValueChange={setStoreId}>
            <SelectTrigger className="w-[400px]">
              <SelectValue placeholder="選則廠商" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                <SelectLabel>室內模擬器</SelectLabel>
                {data?.simulator.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>練習場</SelectLabel>
                {data?.ground.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>
        <Label className="flex items-baseline gap-5">
          <h2 className="w-[100px]">輸入點數</h2>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-[400px]"
            type="number"
          />
        </Label>
      </div>
    </Modal>
  );
}
