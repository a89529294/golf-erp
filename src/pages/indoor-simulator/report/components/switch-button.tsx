import React from "react";
import { useSearchParams } from "react-router-dom";

export function SwitchButton({
  children,
  activeValue,
}: {
  children: React.ReactNode;
  activeValue: "revenue" | "order";
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  function updateQuery() {
    const searchParamsKeyValue = {} as Record<string, string>;
    searchParams.forEach((value, key) => (searchParamsKeyValue[key] = value));
    searchParamsKeyValue["query"] = activeValue;
    setSearchParams(searchParamsKeyValue);
  }

  return (
    <button
      className="rounded-full border border-line-gray bg-white px-5 py-2 text-secondary-dark data-[state=active]:border-none data-[state=active]:bg-secondary-dark data-[state=active]:text-white"
      data-state={
        searchParams.get("query") === activeValue ? "active" : "inactive"
      }
      onClick={updateQuery}
    >
      {children}
    </button>
  );
}
