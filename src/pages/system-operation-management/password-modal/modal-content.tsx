import { TextButton } from "@/components/ui/button";
import circleIcon from "@/assets/circle.svg";

export function PasswordModalContent({
  chName,
  password,
  onConfirm,
}: {
  chName: string;
  password: string;
  onConfirm: () => void;
}) {
  return (
    <form
      className="flex w-[377px] flex-col pb-5"
      onSubmit={(e) => {
        e.preventDefault();
        onConfirm();
      }}
    >
      <div className="bg-light-gray py-2 text-center">{chName}的密碼</div>
      <div className="flex justify-center pb-11 pt-7">
        {password ? (
          password
        ) : (
          <img src={circleIcon} className="h-5 w-5 animate-spin" />
        )}
      </div>
      <TextButton className="self-center">確定</TextButton>
    </form>
  );
}
