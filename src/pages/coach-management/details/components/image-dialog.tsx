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
        <img className="h-20 w-20 object-contain" src={imgSrc} />
      </DialogTrigger>
      <DialogContent className="h-4/6 w-4/6 border-none bg-transparent">
        <DialogHeader>
          <DialogDescription />
        </DialogHeader>
        <img className="h-full w-full object-contain" src={imgSrc} />
      </DialogContent>
    </Dialog>
  );
}
