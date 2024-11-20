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
    mutationKey: ["add-coupon"],
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
        <div className="flex w-full flex-col">
          <header className="bg-light-gray py-2 text-center">新增優惠券</header>

          <div className="flex flex-1 items-center justify-center pb-10 ">
            <div className="flex w-[400px] flex-col gap-6 sm:w-72 sm:gap-3 sm:px-2">
              <Label className="mt-10 flex items-center gap-5">
                <h2 className="w-20 shrink-0">標題</h2>
                <UnderscoredInput
                  className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                  name={"name"}
                  disabled={false}
                  required
                />
              </Label>
              <Label className="flex items-center gap-5 ">
                <h2 className="w-20 shrink-0">編號</h2>
                <UnderscoredInput
                  className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                  name={"number"}
                  disabled={false}
                  required
                />
              </Label>
              <Label className="flex items-center gap-5 ">
                <h2 className="w-20 shrink-0">使用期限</h2>
                <div className="flex flex-1 flex-row items-baseline sm:w-auto sm:min-w-0 sm:flex-1">
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
                <h2 className="w-20 shrink-0">金額</h2>
                <UnderscoredInput
                  className="w-80 sm:w-auto sm:min-w-0 sm:flex-1"
                  name={"amount"}
                  disabled={false}
                  type="number"
                  required
                />
              </Label>
              <Label className="flex items-center gap-5">
                <h2 className="w-20 shrink-0">有效</h2>
                <div className="h-4 w-80 sm:w-auto sm:min-w-0 sm:flex-1">
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
