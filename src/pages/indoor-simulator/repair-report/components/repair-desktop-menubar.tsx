import { Modal } from "@/components/modal";
import { SearchInput } from "@/components/search-input";
import { IconWarningButton } from "@/components/ui/button";

export function RepairDesktopMenubar({
  rowSelection,
  onDeleteRepairReports,
  globalFilter,
  setGlobalFilter,
}: {
  rowSelection: Record<string, boolean>;
  onDeleteRepairReports: () => void;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
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
