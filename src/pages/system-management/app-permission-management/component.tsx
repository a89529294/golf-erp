import { IconShortButton } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main-layout";
import { useLayoutEffect, useRef, useState } from "react";

export function Component() {
  const ref = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setContainerHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <MainLayout>
      <div className=" w-full self-stretch" ref={ref}>
        <ScrollArea
          style={{ height: `${containerHeight - 10}px` }}
          className="mb-2.5 border border-line-gray bg-light-gray px-5 py-12"
        >
          {containerHeight ? (
            <div className="">
              <Section />
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </MainLayout>
  );
}

const users = [
  {
    idNumber: "GF001",
    username: "王小明",
    telphone: "0900111222",
    category: "高爾夫",
    store: "高仕高爾夫練習場-西屯朝馬總店",
  },
  {
    idNumber: "GF002",
    username: "王小明",
    telphone: "0900111222",
    category: "高爾夫",
    store: "高仕高爾夫練習場-西屯朝馬總店",
  },
  {
    idNumber: "GF003",
    username: "王小明",
    telphone: "0900111222",
    category: "高爾夫",
    store: "高仕高爾夫練習場-西屯朝馬總店",
  },
];

function Section() {
  return (
    <section>
      <header className="flex items-center">
        <label className="px-6 py-5">
          <input type="checkbox" className="peer hidden" />
          <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:border-secondary-dark peer-checked:before:block" />
        </label>
        <h2 className="font-semibold">模擬器 / 基本操作</h2>
        <IconShortButton className="ml-auto mr-px" icon="plus">
          新增人員
        </IconShortButton>
      </header>
      <ul className="bg-white">
        {users.map((user) => (
          <li
            key={user.idNumber}
            className="flex items-center border-b border-line-gray first-of-type:border-t"
          >
            <label className="block px-6 py-5">
              <input type="checkbox" className="peer hidden" />
              <div className="grid h-3 w-3 place-items-center border border-line-gray before:hidden before:h-1.5 before:w-1.5 before:bg-orange peer-checked:border-secondary-dark peer-checked:before:block" />
            </label>
            <div className="mr-14">{user.idNumber}</div>
            <div className="mr-20">{user.username}</div>
            <div className="mr-14">{user.telphone}</div>
            <div className="mr-20">{user.category}</div>
            <div>{user.store}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
