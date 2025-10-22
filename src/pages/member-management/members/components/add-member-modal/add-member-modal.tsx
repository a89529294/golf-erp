import {
  IconButton,
  TextButton,
  TextWarningButton,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { privateFetch } from "@/utils/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function AddMemberModal({
  storeId,
  asMenuItem,
  closeMenu,
  show,
  onClose,
  stores,
}: {
  storeId?: string | null;
  asMenuItem?: boolean;
  closeMenu?: () => void;
  show: boolean;
  onClose?: () => void;
  stores: { id: string; name: string }[];
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    chName: "",
    account: "",
    gender: "none",
    phone: "",
    coin: 0,
    password: "",
    email: "",
    storeId: storeId || "",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register-member"],
    mutationFn: async () => {
      await privateFetch(`/app-users/register`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      setOpen(false);
      onClose && onClose();

      // Reset form
      setFormData({
        chName: "",
        account: "",
        gender: "none",
        phone: "",
        coin: 0,
        password: "",
        email: "",
        storeId: storeId || "",
      });
      setErrors({});

      toast.success("新增App使用者成功");
    },
    onError: (e) => {
      console.log(e);
      toast.error("新增App使用者失敗");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.chName.trim()) {
      newErrors.chName = "請輸入用戶名稱";
    }

    if (!formData.account.trim()) {
      newErrors.account = "請輸入帳號";
    }

    if (!formData.storeId.trim()) {
      newErrors.storeId = "請選擇店家";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "請輸入手機號碼";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "請輸入有效的手機號碼";
    }

    if (!formData.password.trim()) {
      newErrors.password = "請輸入密碼";
    } else if (formData.password.length < 6) {
      newErrors.password = "密碼長度至少需要6個字符";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "請輸入有效的電子郵件地址";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutate();
    }
  };

  // Check if all required fields are filled
  const checkFormValidity = (data: typeof formData) => {
    const requiredFields = [
      "chName",
      "account",
      "storeId",
      "phone",
      "password",
    ];
    const isValid = requiredFields.every((field) => {
      if (typeof data[field as keyof typeof data] === "string") {
        return (data[field as keyof typeof data] as string).trim() !== "";
      }
      return true;
    });

    return isValid;
  };

  const handleInputChange = (field: string, value: string | number) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedFormData);
    setIsFormValid(checkFormValidity(updatedFormData));

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Check form validity on initial load and when form data changes
  useEffect(() => {
    setIsFormValid(checkFormValidity(formData));
  }, []);

  if (!storeId) {
    return null;
  }

  const modalContent = (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);

          // Reset form
          setFormData({
            chName: "",
            account: "",
            gender: "none",
            phone: "",
            coin: 0,
            password: "",
            email: "",
            storeId: storeId || "",
          });
          setErrors({});

          onClose && onClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        {asMenuItem ? (
          <div
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
              closeMenu && closeMenu();
            }}
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            新增App使用者
          </div>
        ) : (
          <TextButton
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 "
          >
            <span className="hidden sm:inline">新增App使用者</span>
            <span className="sm:hidden">新增App使用者</span>
          </TextButton>
        )}
      </DialogTrigger>
      <DialogContent className="w-[600px] max-w-[95vw] overflow-hidden rounded-lg bg-white p-0 shadow-lg">
        <DialogHeader className="bg-gradient-to-r px-6 py-4">
          <DialogTitle className="text-xl font-semibold ">
            新增App使用者
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-6">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem 2rem",
              }}
            >
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="chName"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  用戶名稱
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="chName"
                  value={formData.chName}
                  onChange={(e) => handleInputChange("chName", e.target.value)}
                  required
                  placeholder="請輸入用戶名稱"
                  className={cn(
                    "w-full transition-all duration-200",
                    errors.chName
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  )}
                />
                {errors.chName && (
                  <p className="mt-1 text-xs text-red-500">{errors.chName}</p>
                )}
              </div>

              {/* Store Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="storeId"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  店家
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select
                  value={formData.storeId}
                  onValueChange={(value) => handleInputChange("storeId", value)}
                >
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="請選擇店家" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem value={store.id} key={store.id}>
                        {store.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storeId && (
                  <p className="mt-1 text-xs text-red-500">{errors.storeId}</p>
                )}
              </div>

              {/* Gender Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="gender"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  性別
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="w-full border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue placeholder="請選擇性別" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">不提供</SelectItem>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="account"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  帳號
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="account"
                  value={formData.account}
                  onChange={(e) => handleInputChange("account", e.target.value)}
                  required
                  placeholder="請輸入帳號"
                  className={cn(
                    "w-full transition-all duration-200",
                    errors.account
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  )}
                />
                {errors.account && (
                  <p className="mt-1 text-xs text-red-500">{errors.account}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  手機
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  placeholder="請輸入手機號碼"
                  className={cn(
                    "w-full transition-all duration-200",
                    errors.phone
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  )}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  密碼
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                  placeholder="請輸入密碼"
                  className={cn(
                    "w-full transition-all duration-200",
                    errors.password
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  )}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  信箱
                  <span className="ml-1 text-xs text-gray-400">(非必填)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="請輸入電子郵件"
                  className={cn(
                    "w-full transition-all duration-200",
                    errors.email
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Initial Points Field */}
              {/* <div className="space-y-1.5">
                <Label
                  htmlFor="coin"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  初始點數
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="coin"
                  type="number"
                  min="0"
                  value={formData.coin}
                  onChange={(e) =>
                    handleInputChange("coin", parseInt(e.target.value) || 0)
                  }
                  required
                  placeholder="請輸入初始點數"
                  className="w-full border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div> */}
            </div>
          </div>

          <DialogFooter className="mt-6 justify-center border-t border-gray-200 bg-white p-4">
            <TextButton
              type="button"
              loading={isPending}
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isPending || !isFormValid}
            >
              {isPending ? "處理中..." : "新增"}
            </TextButton>
            <DialogPrimitive.Close asChild>
              <TextWarningButton
                disabled={isPending}
                onClick={() => {
                  setOpen(false);
                  onClose && onClose();
                }}
              >
                取消
              </TextWarningButton>
            </DialogPrimitive.Close>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  if (show === false) return null;

  return modalContent;
}
