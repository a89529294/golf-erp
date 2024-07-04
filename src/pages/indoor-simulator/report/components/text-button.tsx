export function TextButton({
  children,
  onClick = () => {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className="self-start border border-line-gray bg-light-gray px-1.5"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
