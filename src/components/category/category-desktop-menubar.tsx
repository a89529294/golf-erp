import plusIcon from "@/assets/plus-icon.svg";
// import { SearchInput } from "@/components/search-input";
import { button } from "@/components/ui/button-cn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  GolfStoreWithSites,
  GroundStoreWithSites,
  SimulatorStoreWithSites,
} from "@/pages/store-management/loader";
import { Link } from "react-router-dom";

export function CategoryDesktopMenubar({
  newSiteHref,
  earlyBirdPricingHref,
  globalFilter,
  setGlobalFilter,
  storeId,
  onStoreValueChange,
  stores,
  type,
}: {
  newSiteHref: string;
  earlyBirdPricingHref: string;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  storeId: string | undefined;
  onStoreValueChange: (storeId: string, replace: boolean) => void;
  stores:
    | GolfStoreWithSites[]
    | GroundStoreWithSites[]
    | SimulatorStoreWithSites[];
  type: "golf" | "ground" | "simulator";
}) {
  const { user } = useAuth();

  const enableEarlyBird =
    (type === "simulator" &&
      user!.permissions.includes("模擬器-編輯場地價格")) ||
    (type === "golf" && user!.permissions.includes("高爾夫球-編輯場地價格")) ||
    (type === "ground" && user!.permissions.includes("練習場-編輯場地價格"));
  return (
    <>
      <div className="flex gap-2">
        <Link to={newSiteHref} className={button()} id="new-site-link">
          <img src={plusIcon} />
          新增場地
        </Link>
      </div>
      {/* <SearchInput value={globalFilter} setValue={setGlobalFilter} /> */}
      <Select
        value={storeId}
        onValueChange={(v) => onStoreValueChange(v, false)}
      >
        <SelectTrigger className="h-11 w-[280px] rounded-none border-0 border-b border-secondary-dark">
          <SelectValue placeholder="選擇廠商" />
        </SelectTrigger>
        <SelectContent className="w-[280px]">
          {stores.length === 0 ? (
            <SelectItem key={0} value="undef" disabled>
              請先新增
              {type === "golf"
                ? "高爾夫廠商"
                : type === "ground"
                  ? "練習場廠商"
                  : "模擬器廠商"}
            </SelectItem>
          ) : (
            stores.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      <Link
        to={earlyBirdPricingHref}
        className={cn(
          button({ borderLess: true }),
          "hover:outline-[1.5px] hover:outline-orange",
          !enableEarlyBird && "opacity-50",
        )}
        onClick={(e) => {
          if (!enableEarlyBird) e.preventDefault();
        }}
      >
        早鳥定價
      </Link>
    </>
  );
}
