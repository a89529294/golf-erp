import { cn } from "@/lib/utils";
import pencil from "@/assets/pencil.svg";
import { CouponModalBase } from "./coupon-modal-base";
import { Label } from "@/components/ui/label";
import { UnderscoredInput } from "@/components/underscored-input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { privateFetch } from "@/utils/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export function EditCouponModal({
  id,
  name,
  expiration,
  amount,
  number,
  isActive,
}: {
  id: string;
  name: string;
  expiration: number;
  amount: number;
  number: string;
  isActive: boolean;
}) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: ["update-coupon"],
    mutationFn: async (prop: {
      name: string;
      expiration: number;
      amount: number;
      number: string;
      isActive: boolean;
    }) => {
      await privateFetch(`/coupon/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(prop),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("修改優惠券成功");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  return (
    <div className={cn("hidden pr-6 text-right group-hover:block")}>
      <CouponModalBase
        dialogTriggerChildren={
          <button className="">
            <img alt="pencil" src={pencil} />
          </button>
        }
        onSubmit={async (e) => {
          const formData = new FormData(e.currentTarget);
          await mutateAsync({
            name: formData.get("name") as string,
            expiration: +formData.get("expiration")!,
            amount: +formData.get("amount")!,
            number: formData.get("number") as string,
            isActive: !!formData.get("isActive"),
          });
        }}
      >
        <div className="flex w-full flex-col">
          <header className="bg-light-gray py-2 text-center">編輯優惠券</header>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-10">
            <Label className="mt-10 flex items-center gap-5">
              <h2 className="w-16">標題</h2>
              <UnderscoredInput
                className="w-80"
                name={"name"}
                disabled={false}
                required
                defaultValue={name}
              />
            </Label>
            <Label className="flex items-center gap-5 ">
              <h2 className="w-16">編號</h2>
              <UnderscoredInput
                className="w-80"
                name={"number"}
                disabled={false}
                required
                defaultValue={number}
              />
            </Label>
            <Label className="flex items-center gap-5 ">
              <h2 className="w-16">使用期限</h2>
              <div className="flex flex-row items-baseline">
                <UnderscoredInput
                  className="w-80"
                  name={"expiration"}
                  disabled={false}
                  type="number"
                  required
                  defaultValue={expiration}
                />
                天
              </div>
            </Label>
            <Label className="flex items-center gap-5 ">
              <h2 className="w-16">金額</h2>
              <UnderscoredInput
                className="w-80"
                name={"amount"}
                disabled={false}
                type="number"
                required
                defaultValue={amount}
              />
            </Label>
            <Label className="flex items-center gap-5">
              <h2 className="w-16">有效</h2>
              <div className="h-4 w-80">
                <Checkbox name="isActive" defaultChecked={isActive} />
              </div>
            </Label>
          </div>
        </div>
      </CouponModalBase>
    </div>
  );
}
