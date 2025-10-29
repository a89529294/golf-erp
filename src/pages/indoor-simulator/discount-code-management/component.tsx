import { loader } from ".";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
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

  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId");

  if (!storeId) {
    navigate("/", { replace: true });
  }

  const initialData = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      amount: 0,
      isActive: true,
    },
  });

  const { data: discountCodes, isLoading } = useQuery({
    queryKey: ["discount-codes", storeId],
    queryFn: async () => {
      const response = await privateFetch(
        `/store/${storeId}/discount-code?page=1&pageSize=99`,
      ).then((r) => r.json());
      const parsed = paginatedResponseSchema.parse(response);
      return parsed.data;
    },
    enabled: !!storeId,
  });

  const { mutateAsync: createDiscountCode, isPending: isCreating } =
    useMutation({
      mutationKey: ["create-discount-code"],
      mutationFn: async (values: FormValues) => {
        await privateFetch("/store/discount-code", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            storeId,
          }),
        });
      },
      onSuccess() {
        toast.success("新增優惠碼成功");
        form.reset();
        return queryClient.invalidateQueries({
          queryKey: ["discount-codes", storeId],
        });
      },
      onError(error) {
        toast.error(`新增優惠碼失敗: ${error.message}`);
      },
    });

  const onSubmit = async (values: FormValues) => {
    await createDiscountCode(values);
  };

  const handleCodeClick = (codeId: string) => {
    navigate(`/indoor-simulator/discount-code-management/${storeId}/${codeId}`);
  };

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
      <div className="grid h-full w-full grid-cols-2 gap-4 p-4 sm:grid-cols-1">
        {/* Left side - Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">新增優惠碼</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
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

                <IconButton
                  type="submit"
                  icon="save"
                  className="float-right"
                  disabled={isCreating}
                >
                  {isCreating ? "新增中..." : "新增優惠碼"}
                </IconButton>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right side - List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">優惠碼列表</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
              </div>
            ) : discountCodes && discountCodes.length > 0 ? (
              <div className="space-y-2">
                {discountCodes.map((code) => (
                  <div
                    key={code.id}
                    onClick={() => handleCodeClick(code.id)}
                    className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{code.name}</h3>
                        <p className="text-sm text-gray-600">
                          編碼: {code.code}
                        </p>
                        <p className="text-sm text-gray-600">
                          金額: ${code.amount}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          code.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {code.isActive ? "啟用" : "停用"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-gray-500">尚無優惠碼</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
