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

export function Component() {
  const navigate = useNavigate();
  const { id } = useParams();
  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { storeId } = useParams();
  const { data: coach } = useQuery({
    ...genCoachDetailsQuery(storeId!),
    initialData,
  });

  const queryClient = useQueryClient();

  const { mutate: toggleCoachStatus, isPending: isUpdatingMemberStatus } =
    useMutation({
      mutationKey: ["update-coach-status"],
      mutationFn: async () => {
        const response = await privateFetch(`/app-users/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            isVerified:
              coach.verificationStatus === "pending" ||
              coach.verificationStatus === "rejected",
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
      },
    });

  return (
    <MainLayout
      headerChildren={
        <>
          <Link
            className={cn(
              button(),
              isUpdatingMemberStatus && "pointer-events-none opacity-50",
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
          {coach.verificationStatus === "verified" ? (
            <IconWarningButton
              disabled={isUpdatingMemberStatus}
              onClick={() => toggleCoachStatus()}
              icon="redX"
            >
              審核失敗
            </IconWarningButton>
          ) : (
            <IconButton
              className="bg-secondary-purple/10 text-secondary-purple outline-secondary-purple"
              icon="check"
              onClick={() => toggleCoachStatus()}
              disabled={isUpdatingMemberStatus}
            >
              審核成功
            </IconButton>
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
                <Row label="審核狀態" value={coach.verificationStatus} />
                <div className="grid grid-cols-[auto_1fr] items-center gap-y-1 sm:grid-cols-1">
                  <div className="w-28">大頭照</div>
                  <div className="h-10 w-10">
                    <img className="object-contain" alt="" src={coach.pfp} />
                  </div>
                </div>
              </section>

              <section className="flex w-[613px] flex-col gap-6 border border-line-gray px-12 pb-10 sm:w-80">
                <div className="-mx-12 mb-4 bg-light-gray py-1.5 text-center text-black">
                  資歷
                </div>

                <ScrollArea className="w-full ">
                  <div className="flex gap-5">
                    {coach.qualifications.map((q, idx) => {
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
                    {coach.certificates.map((q, idx) => {
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

                {coach.lessonPlans.map((lessonPlan, idx) => {
                  return (
                    <div key={idx}>
                      <h2 className="text-lg ">{lessonPlan.title}</h2>
                      <div className="flex flex-col gap-2">
                        {lessonPlan.details.map((details, idx) => {
                          return (
                            <div key={idx} className="flex gap-2">
                              <div>{details.orderName}</div>
                              <div>{details.title}</div>
                              <div>{details.content}</div>
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

                {Object.entries(coach.availability).map(
                  ([day, { start, end }], idx) => {
                    return (
                      <div key={idx} className="flex gap-5">
                        <h2 className="w-28 text-lg">{day}</h2>
                        <div className="flex gap-2">
                          <div>{start}</div>
                          <div>{end}</div>
                        </div>
                      </div>
                    );
                  },
                )}
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
