import backIcon from "@/assets/back.svg";
import { MainLayout } from "@/layouts/main-layout";
import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";

import { IconButton, IconWarningButton } from "@/components/ui/button";
import { button } from "@/components/ui/button-cn";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { privateFetch } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { genCoachDetailsQuery, loader } from "./loader";

import { ImageDialog } from "@/pages/coach-management/details/components/image-dialog";
import { useRef } from "react";

export function Component() {
  const statusRef = useRef<"審核中" | "審核成功" | "審核失敗">("審核中");
  const navigate = useNavigate();
  const { coachId } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { data: coach, isFetching: isFetchingCoachStatus } = useQuery({
    ...genCoachDetailsQuery(coachId!),
    initialData,
  });

  const queryClient = useQueryClient();

  const { mutate: updateCoachStatus, isPending: isUpdatingCoachStatus } =
    useMutation({
      mutationKey: ["update-coach-status"],
      mutationFn: async (status: "pending" | "pass" | "decline") => {
        const statusObj = {
          pass: "審核成功",
          decline: "審核失敗",
          pending: "審核中",
        } as const;
        statusRef.current = statusObj[status];
        const response = await privateFetch(`/coach/${coachId}`, {
          method: "PATCH",
          body: JSON.stringify({
            status,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        return await response.json();
      },
      onSuccess() {
        toast.success("更新狀態成功");
        queryClient.invalidateQueries({ queryKey: ["coaches"] });
        queryClient.invalidateQueries({ queryKey: ["coach", coachId] });
      },
    });

  const coachStatus =
    isUpdatingCoachStatus || isFetchingCoachStatus
      ? statusRef.current
      : coach.status;

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={cn(
              button(),
              isUpdatingCoachStatus && "pointer-events-none opacity-50",
            )}
            to={".."}
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <img src={backIcon} />
            返回
          </Link>
          {coachStatus === "審核成功" ? (
            <>
              <IconWarningButton
                disabled={isUpdatingCoachStatus}
                onClick={() => updateCoachStatus("decline")}
                icon="redX"
              >
                審核失敗
              </IconWarningButton>
              <IconButton
                disabled={isUpdatingCoachStatus}
                onClick={() => updateCoachStatus("pending")}
                icon="reset"
              >
                審核中
              </IconButton>
            </>
          ) : coachStatus === "審核中" ? (
            <>
              <IconButton
                className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
                icon="check"
                onClick={() => updateCoachStatus("pass")}
                disabled={isUpdatingCoachStatus}
              >
                審核成功
              </IconButton>
              <IconButton
                className="bg-red-500/10 text-red-500 outline-red-500"
                icon="redX"
                onClick={() => updateCoachStatus("decline")}
                disabled={isUpdatingCoachStatus}
              >
                審核失敗
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
                icon="check"
                onClick={() => updateCoachStatus("pass")}
                disabled={isUpdatingCoachStatus}
              >
                審核成功
              </IconButton>
              <IconButton
                disabled={isUpdatingCoachStatus}
                onClick={() => updateCoachStatus("pending")}
                icon="reset"
              >
                審核中
              </IconButton>
            </>
          )}
        </>
      }
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0 mb-2.5 border border-line-gray bg-light-gray">
          <ScrollArea className="h-full ">
            <div className="flex flex-col items-center gap-4 pt-12">
              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  基本資料
                </div>
                <Row label="姓名" value={coach.name} />
                <Row label="電話" value={coach.phone} />
                <Row label="審核狀態" value={coachStatus} />
                <div className="grid grid-cols-[auto_1fr] items-center gap-y-1 sm:grid-cols-1">
                  <div className="w-28">大頭照</div>
                  <div className="h-10 w-10">
                    <img
                      className="object-contain"
                      alt=""
                      src={coach.avatarSrc}
                    />
                  </div>
                </div>
              </section>

              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  資歷
                </div>

                <ScrollArea className="w-full ">
                  <div className="flex gap-5">
                    {coach.resumesSrc.map((q, idx) => {
                      return <ImageDialog key={idx} imgSrc={q} />;
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>

              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  證書
                </div>

                <ScrollArea className="w-full ">
                  <div className="flex gap-5">
                    {coach.certificatesSrc.map((q, idx) => {
                      return <ImageDialog key={idx} imgSrc={q} />;
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>

              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  教學計劃
                </div>

                {coach.educatePlan.map((lessonPlan, idx) => {
                  return (
                    <div key={idx} className="space-y-2">
                      <h2 className="text-lg font-bold">
                        課程名稱:
                        <span className="pl-1 font-normal">
                          {lessonPlan.subtitle}
                        </span>
                      </h2>
                      <div className="flex flex-col gap-1">
                        {lessonPlan.class.map((details, idx) => {
                          return (
                            <div key={idx} className="">
                              <div className="flex gap-1">
                                <div className="font-medium">課堂標題:</div>
                                <div>{details.title}</div>
                              </div>
                              <div className="flex gap-1">
                                <div className="font-medium">課堂內容:</div>
                                <div>{details.content}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  時間
                </div>

                {coach.openTimes?.map((details, idx) => {
                  const dayToWeekday: Record<number, string> = {
                    1: "星期一",
                    2: "星期二",
                    3: "星期三",
                    4: "星期四",
                    5: "星期五",
                    6: "星期六",
                    7: "星期日",
                  };

                  return (
                    <div key={idx} className="flex gap-5">
                      <h2 className="w-28 text-lg">
                        {dayToWeekday[details.day]}
                      </h2>
                      <div className="flex gap-2">
                        {details.times.map((time, idx) => (
                          <div className="flex gap-1" key={idx}>
                            <span className="w-14">{time.startTime}</span>至
                            <span className="w-14">{time.endTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </MainLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-baseline gap-y-1 sm:grid-cols-1">
      <div className="w-28">{label}</div>

      <div
        className={cn(
          "h-7 rounded-none border-0 border-b border-b-secondary-dark bg-transparent p-1 ",
        )}
      >
        {value}
      </div>
    </div>
  );
}
