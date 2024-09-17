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
import { Row } from "@/pages/coach-management/details/components/row";

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
                className="text-red-500 bg-red-500/10 outline-red-500"
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
      <div className="relative w-full h-full">
        <div className="absolute inset-0 mb-2.5 border border-line-gray bg-light-gray">
          <ScrollArea className="h-full ">
            <div className="flex flex-col items-center pt-12 gap-7">
              <section className="flex w-[613px] flex-col gap-6 border border-line-gray bg-white px-16 pb-10 sm:w-80">
                <div className="-mx-16 mb-10 bg-light-gray py-1.5 text-center text-black ">
                  基本資料
                </div>

                <div className="flex items-center gap-7">
                  <div className="h-[180px] w-[150px]">
                    <img
                      className="object-cover h-full"
                      alt=""
                      src={coach.avatarSrc}
                    />
                  </div>

                  <div className="flex flex-col flex-1 gap-7">
                    <Row label="姓名" value={coach.name} />
                    <Row label="電話" value={coach.phone} />
                    <Row label="審核狀態" value={coach.status} />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-medium">資歷</h2>

                <div className="w-[613px] border-y border-line-gray">
                  <ScrollArea className="w-full p-5 bg-white">
                    <div className="flex gap-5">
                      {coach.resumesSrc.map((q, idx) => {
                        return <ImageDialog key={idx} imgSrc={q} />;
                      })}
                      {coach.resumesSrc.length === 0 && "暫無資料"}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-medium">證書</h2>

                <div className="w-[613px] border-y border-line-gray">
                  <ScrollArea className="w-full p-5 bg-white">
                    <div className="flex gap-5">
                      {coach.certificatesSrc.map((q, idx) => {
                        return <ImageDialog key={idx} imgSrc={q} />;
                      })}
                      {coach.certificatesSrc.length === 0 && "暫無資料"}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
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

              <section className="space-y-4">
                <h2 className="font-medium">開放時間</h2>

                <div className="flex w-[613px] flex-col items-center gap-5 border-y border-line-gray bg-white py-4">
                  {coach.openTimes?.map((q, idx) => {
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
                      <div key={idx} className="flex items-center gap-4">
                        <span className="font-medium">
                          {dayToWeekday[q.day]}
                        </span>
                        <div className="flex gap-1.5 rounded-md bg-light-gray px-4 pb-1.5 pt-2.5">
                          <div className="w-16 border-b border-secondary-dark">
                            {q.times[0].startTime}
                          </div>
                          ～
                          <div className="w-16 border-b border-secondary-dark">
                            {q.times[0].endTime}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!coach.openTimes ||
                    (coach.openTimes.length === 0 && "暫無資料")}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-medium">教學計劃</h2>

                {coach.educatePlan.map((plan, idx) => {
                  return (
                    <div
                      className="w-[613px] space-y-7 border-t border-line-gray bg-white px-5 py-7"
                      key={idx}
                    >
                      <div className="flex gap-5">
                        <div className="w-16 font-medium">課程名稱</div>
                        <div>{plan.subtitle}</div>
                      </div>

                      {plan.class.map((c, idx) => {
                        return (
                          <div key={idx} className="flex ">
                            <div className="w-[84px] " />
                            <div className="relative flex-1 px-5 py-6 rounded-md bg-light-gray">
                              <h3 className="absolute top-0 -translate-y-1/2 text-word-gray-dark">
                                第{idx + 1}堂
                              </h3>

                              <div className="flex gap-5 mb-5">
                                <div className="font-medium">課堂標題</div>
                                <div className="flex-1 border-b border-secondary-dark">
                                  {c.title}
                                </div>
                              </div>

                              <div className="flex gap-5">
                                <div className="font-medium">課堂內容</div>
                                <div className="flex-1 border-b border-secondary-dark">
                                  {c.content}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
