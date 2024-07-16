import { IconButtonBorderLess } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useNavigation } from "react-router-dom";

export function UserDisplayLogout() {
  const { user, logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   if (navigation.state === "idle" && ref.current) {
  //     if (
  //       ref.current.getBoundingClientRect().right !==
  //       document.documentElement.clientWidth
  //     ) {
  //       setShiftRightBy(
  //         document.documentElement.clientWidth -
  //           ref.current.getBoundingClientRect().right,
  //       );
  //     }
  //   } else {
  //     setShiftRightBy(0);
  //   }

  //   const fn = () => {
  //     if (navigation.state === "idle" && ref.current) {
  //       console.log(
  //         document.documentElement.clientWidth,
  //         ref.current.getBoundingClientRect().right,
  //       );
  //       if (
  //         ref.current.getBoundingClientRect().right !==
  //         document.documentElement.clientWidth
  //       ) {
  //         setShiftRightBy(
  //           document.documentElement.clientWidth -
  //             ref.current.getBoundingClientRect().right,
  //         );
  //       }
  //     } else {
  //       setShiftRightBy(0);
  //     }
  //   };

  //   window.addEventListener("resize", fn);
  // }, [navigation.state]);

  return (
    <div
      className={cn(
        "sticky top-0 z-10 flex h-20 shrink-0 border-r-[10px] border-r-light-blue bg-light-gray py-2.5 pl-2.5",
        navigation.state !== "idle" && "invisible",
      )}
      // style={{
      //   transform: `translateX(${shiftRightBy}px)`,
      // }}
      ref={ref}
    >
      <IconButtonBorderLess icon="pfp">{user?.username}</IconButtonBorderLess>
      <div className="h-full border-r border-line-gray" />
      <IconButtonBorderLess icon="leave" onClick={logout}>
        登出
      </IconButtonBorderLess>
    </div>
  );
}
