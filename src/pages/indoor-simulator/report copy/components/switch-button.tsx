import { DataType } from "@/types-and-schemas/report";
import React from "react";

export function SwitchButton({
  children,
  value,
  activeDataType,
  setActiveDataType,
}: {
  children: React.ReactNode;
  value: DataType;
  activeDataType: DataType;
  setActiveDataType: React.Dispatch<React.SetStateAction<DataType>>;
}) {
  return (
    <button
      className="rounded-full border border-line-gray bg-white px-5 py-2 text-secondary-dark data-[state=active]:border-none data-[state=active]:bg-secondary-dark data-[state=active]:text-white"
      data-state={activeDataType === value ? "active" : "inactive"}
      onClick={() => setActiveDataType(value)}
    >
      {children}
    </button>
  );
}
