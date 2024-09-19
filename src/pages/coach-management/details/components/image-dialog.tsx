import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ImageDialog({ imgSrc }: { imgSrc: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img className="h-[120px] w-[120px] object-contain" src={imgSrc} />
      </DialogTrigger>
      <DialogContent className="w-4/6 bg-transparent border-none h-4/6">
        <DialogHeader>
          <DialogDescription />
        </DialogHeader>
        <img className="object-contain w-full h-full" src={imgSrc} />
      </DialogContent>
    </Dialog>
  );
}
