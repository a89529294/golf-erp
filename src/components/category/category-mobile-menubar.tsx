import plusIcon from "@/assets/plus-icon.svg";
import { button } from "@/components/ui/button-cn";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GolfStoreWithSites,
  GroundStoreWithSites,
  SimulatorStoreWithSites,
} from "@/pages/store-management/loader";
import React from "react";
import { Link } from "react-router-dom";

export function CategoryMobileMenubar({
  newSiteHref,

  storeId,
  onStoreValueChange,
  stores,
  type,
}: {
  newSiteHref: string;
  storeId: string | undefined;
  onStoreValueChange: (storeId: string, replace: boolean) => void;
  stores:
    | GolfStoreWithSites[]
    | GroundStoreWithSites[]
    | SimulatorStoreWithSites[];
  type: "golf" | "ground" | "simulator";
}) {
  const [value, setValue] = React.useState("");

  return (
    <div className="flex gap-1">
      <Menubar
        value={value}
        onValueChange={setValue}
        className="h-auto border-none bg-transparent"
      >
        <MenubarMenu value="category-mobile-menu">
          <MenubarTrigger className={button()}>選項</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link className="flex gap-1" to={newSiteHref} id="new-site-link">
                <img src={plusIcon} />
                新增場地
              </Link>
            </MenubarItem>
            {/* <MenubarItem>
            <Select
              value={storeId}
              onValueChange={(v) => {
                onStoreValueChange(v, false);
                setValue("");
              }}
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
          </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Select
        value={storeId}
        onValueChange={(v) => {
          onStoreValueChange(v, false);
          setValue("");
        }}
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
    </div>
  );
}
