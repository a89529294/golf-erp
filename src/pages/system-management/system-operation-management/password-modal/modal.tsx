import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PasswordModalContent } from "@/pages/system-management/system-operation-management/password-modal/modal-content";
import { privateFetch } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import underscoredGoldStar from "@/assets/underscored-gold-star.svg";
import { useEffect, useState } from "react";
import { z } from "zod";

const responseSchema = z.object({ password: z.string() });

export function PasswordModal({ chName, id }: { chName: string; id: string }) {
  // const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate } = useMutation({
    mutationKey: ["reset-user-password"],
    mutationFn: async () => {
      setPassword("");
      const response = await privateFetch(`/users/${id}/reset_password`, {
        method: "PATCH",
      });

      const data = responseSchema.parse(await response.json());
      setPassword(data.password);
    },
  });

  useEffect(() => {
    if (open) mutate();
  }, [mutate, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex gap-0.5">
          <img src={underscoredGoldStar} />
          <img src={underscoredGoldStar} />
          <img src={underscoredGoldStar} />
          <img src={underscoredGoldStar} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <PasswordModalContent
          chName={chName}
          password={password}
          onConfirm={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
