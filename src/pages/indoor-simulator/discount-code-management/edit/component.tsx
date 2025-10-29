import { loader } from ".";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/layouts/main-layout.tsx";
import { StoreSelect } from "@/components/category/store-select.tsx";
import { privateFetch } from "@/utils/utils.ts";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const category = "simulator";
const navigateTo = "/indoor-simulator/discount-code-management";

const discountCodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  amount: z.number(),
  isActive: z.boolean(),
});

const paginatedResponseSchema = z.object({
  data: z.array(discountCodeSchema),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    itemCount: z.number(),
    pageCount: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
  }),
});

type DiscountCode = z.infer<typeof discountCodeSchema>;

const formSchema = z.object({
  name: z.string().min(1, "請輸入標題"),
  code: z.string().min(1, "請輸入編碼"),
  amount: z.coerce.number().min(1, "請輸入金額"),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function Component() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { storeId, codeId } = useParams();

  if (!storeId || !codeId) {
    navigate("/", { replace: true });
  }

  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const { data: discountCode, isLoading } = useQuery({
    queryKey: ["discount-code", codeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/store/${storeId}/discount-code?page=1&pageSize=99`,
      ).then((r) => r.json());
      const parsed = paginatedResponseSchema.parse(response);
      return parsed.data.find((c) => c.id === codeId);
    },
    enabled: !!storeId && !!codeId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: discountCode
      ? {
          name: discountCode.name,
          code: discountCode.code,
          amount: discountCode.amount,
          isActive: discountCode.isActive,
        }
      : undefined,
  });

  const { mutateAsync: updateDiscountCode, isPending: isUpdating } =
    useMutation({
      mutationKey: ["update-discount-code"],
      mutationFn: async (values: FormValues) => {
        await privateFetch(`/store/discount-code/${codeId}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      },
      onSuccess() {
        toast.success("更新優惠碼成功");
        return queryClient.invalidateQueries({
          queryKey: ["discount-codes", storeId],
        });
      },
      onError(error) {
        toast.error(`更新優惠碼失敗: ${error.message}`);
      },
    });

  const onSubmit = async (values: FormValues) => {
    await updateDiscountCode(values);
  };

  const handleBack = () => {
    navigate(`/indoor-simulator/discount-code-management?storeId=${storeId}`);
  };

  if (isLoading) {
    return (
      <MainLayout
        headerChildren={
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
        }
      >
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (!discountCode) {
    return (
      <MainLayout
        headerChildren={
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
        }
      >
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">找不到優惠碼</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      headerChildren={
        <>
          <IconButton icon="back" onClick={handleBack}>
            返回
          </IconButton>
          <StoreSelect
            category={category}
            initialData={initialData}
            navigateTo={navigateTo}
          />
        </>
      }
    >
      <div className="flex h-full w-full items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl">編輯優惠碼</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>標題</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="輸入標題" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>編碼</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="輸入編碼" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>金額</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="輸入金額"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">啟用狀態</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 self-end">
                  <IconButton
                    type="submit"
                    icon="save"
                    disabled={isUpdating || !form.formState.isDirty}
                  >
                    {isUpdating ? "更新中..." : "儲存"}
                  </IconButton>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
