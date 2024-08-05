export function ImagePortalContainer({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-10 bg-black/50" onClick={onClose}>
      <img
        src={src}
        className="absolute left-1/2 top-1/2 h-3/4 w-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
      />
    </div>
  );
}
