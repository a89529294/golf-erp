import { MainLayout } from "@/layouts/main-layout";
import { coachesQuery, loader } from "@/pages/coach-management/loader";
import { DataTable } from "@/pages/coach-management/data-table/data-table";
import { columns } from "@/pages/coach-management/data-table/columns";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
// import { useIsMobile } from "@/hooks/use-is-mobile";
// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarTrigger,
// } from "@/components/ui/menubar";
// import { button } from "@/components/ui/button-cn";
// import { cn } from "@/lib/utils";
// import backIcon from "@/assets/back.svg";

export function Component() {
  // const navigate = useNavigate();
  // const isMobile = useIsMobile();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: coaches } = useQuery({
    ...coachesQuery,
    initialData,
  });

  return (
    <MainLayout
    // headerChildren={
    //   isMobile ? (
    //     <Menubar className="h-auto bg-transparent border-none">
    //       <MenubarMenu>
    //         <MenubarTrigger className={button()}>選項</MenubarTrigger>
    //         <MenubarContent>
    //           <MenubarItem>
    //             <Link
    //               className={cn("flex gap-1")}
    //               to={".."}
    //               onClick={(e) => {
    //                 e.preventDefault();
    //                 navigate(-1);
    //               }}
    //             >
    //               <img src={backIcon} />
    //               返回
    //             </Link>
    //           </MenubarItem>
    //         </MenubarContent>
    //       </MenubarMenu>
    //     </Menubar>
    //   ) : null
    // }
    >
      {({ height }) => {
        return (
          <div className="flex w-full flex-col border border-t-0 border-line-gray bg-light-gray px-1">
            <DataTable
              columns={columns}
              data={coaches}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        );
      }}
    </MainLayout>
  );
}
