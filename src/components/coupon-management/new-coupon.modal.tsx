import { IconButton } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UnderscoredInput } from "@/components/underscored-input";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CouponModalBase } from "./coupon-modal-base";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";

export function NewCouponModal({
  category,
}: {
  category: "ground" | "golf" | "simulator";
}) {
  const [searchParams] = useSearchParams();
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
      await privateFetch(`/coupon/${category}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...prop,
          storeId: searchParams.get("storeId"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess() {
      toast.success("新增優惠券成功");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  return (
    <div>
      <CouponModalBase
        dialogTriggerChildren={<IconButton icon="plus">新增優惠券</IconButton>}
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
        <div className="flex flex-col w-full">
          <header className="py-2 text-center bg-light-gray">新增優惠券</header>

          <div className="flex items-center justify-center flex-1 pb-10">
            <div className="flex w-[400px] flex-col gap-6">
              <Label className="flex items-center gap-5 mt-10">
                <h2 className="w-16">標題</h2>
                <UnderscoredInput
                  className="w-80"
                  name={"name"}
                  disabled={false}
                  required
                />
              </Label>
              <Label className="flex items-center gap-5 ">
                <h2 className="w-16">編號</h2>
                <UnderscoredInput
                  className="w-80"
                  name={"number"}
                  disabled={false}
                  required
                />
              </Label>
              <Label className="flex items-center gap-5 ">
                <h2 className="w-16 ">使用期限</h2>
                <div className="flex flex-row items-baseline flex-1">
                  <UnderscoredInput
                    className="w-full"
                    name={"expiration"}
                    disabled={false}
                    type="number"
                    required
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
                />
              </Label>
              <Label className="flex items-center gap-5">
                <h2 className="w-16">有效</h2>
                <div className="h-4 w-80">
                  <Checkbox name="isActive" />
                </div>
              </Label>
            </div>
          </div>
        </div>
      </CouponModalBase>
    </div>
  );
}
