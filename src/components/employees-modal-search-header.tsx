import MagnifyingGlass from "@/assets/magnifying-glass-icon.svg";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storesQuery } from "@/pages/store-management/loader";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

export function EmployeesModalSearchHeader({
  selectedStoreId,
  setSelectedStoreId,
  globalFilter,
  setGlobalFilter,
}: {
  selectedStoreId: string | undefined;
  setSelectedStoreId: Dispatch<SetStateAction<string | undefined>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
}) {
  const [selectKey, setSelectKey] = useState(0);
  const { data: stores } = useQuery(storesQuery);
  const flattenedStores = stores
    ? Object.values(stores).flatMap((stores) => stores)
    : [];

  return (
    <div className="sticky top-0 z-10 -mx-14 -mb-px flex h-[110px] flex-col border-b border-b-line-gray bg-white  [clip-path:polygon(0_0,100%_0,100%_calc(100%-1px),calc(100%-56px)_calc(100%-1px),calc(100%-56px)_100%,56px_100%,56px_calc(100%-1px),0_calc(100%-1px))]">
      <h1 className="bg-light-gray py-2 text-center">選擇人員</h1>
      <div className="mt-auto flex items-center gap-2 px-14 pb-4">
        <img src={MagnifyingGlass} />
        <Select
          key={selectKey}
          onValueChange={(s) => {
            if (s === "reset") {
              setSelectKey(selectKey + 1);
              setSelectedStoreId(undefined);
            } else setSelectedStoreId(s);
          }}
          value={selectedStoreId}
        >
          <SelectTrigger className="w-48 rounded-none border-0 border-b border-b-secondary-dark px-px ">
            <SelectValue placeholder="選擇店家" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="reset" className="text-muted-foreground">
                清空
              </SelectItem>
              {flattenedStores.map((store) => (
                <SelectItem value={store.id} key={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          className="flex-1 rounded-none border-0 border-b border-b-secondary-dark"
          placeholder="搜尋內容"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
    </div>
  );
}
