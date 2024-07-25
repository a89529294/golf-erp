import { StoreSelect } from "@/components/category/store-select";
import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";

const navMap = {
  ground: "/driving-range/repair-report",
  golf: "/golf/repair-report",
  simulator: "/indoor-simulator/repair-report",
};

export function RepairDesktopMenubar({
  rowSelection,
  onDeleteRepairReports,
  globalFilter,
  setGlobalFilter,
  initialData,
  category,
}: {
  rowSelection: Record<string, boolean>;
  onDeleteRepairReports: () => void;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  initialData: { id: string; name: string }[];
  category: "ground" | "golf" | "simulator";
}) {
  return (
    <>
      <StoreSelect
        category={category}
        initialData={initialData}
        navigateTo={navMap[category]}
      />
      {Object.keys(rowSelection).length > 0 && (
        <Modal
          dialogTriggerChildren={
            <IconWarningButton icon="redX">刪除</IconWarningButton>
          }
          onSubmit={onDeleteRepairReports}
        >
          是否刪除選取的報修回報?
        </Modal>
      )}
      <SearchInput value={globalFilter} setValue={setGlobalFilter} />
    </>
  );
}
