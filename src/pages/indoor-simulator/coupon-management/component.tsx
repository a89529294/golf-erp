import { CouponBaseComponent } from "@/components/coupon-management/coupon-base-component";
import { loader } from ".";

export function Component() {
  return (
    <CouponBaseComponent
      loader={loader}
      category="simulator"
      navigateTo="/indoor-simulator/coupon-management"
    />
  );
}
