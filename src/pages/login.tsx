import { Input } from "@/components/ui/input";
import { useAuth } from "../hooks/use-auth";
import { Label } from "@/components/ui/label";
import eye from "@/assets/eye.svg";
import eyeSlash from "@/assets/eye-slash.svg";
import React from "react";
import { toast } from "sonner";
import loginTopWave from "@/assets/login-top-wave.webp";
import loginBottomWave from "@/assets/login-bottom-wave.webp";
import logo from "@/assets/logo.svg";
import rightCircle from "@/assets/right-circle.svg";
import leftCircle from "@/assets/left-circle.svg";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [logginIn, setLogginIn] = React.useState(false);
  const { login } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    setLogginIn(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    login({
      account: data.get("account") as string,
      password: data.get("password") as string,
    }).catch((e) => {
      console.log(e);
      toast.error("登入失敗,請檢查帳號密碼");
      setLogginIn(false);
    });
  };

  return (
    <div className="relative flex h-full justify-center overflow-hidden">
      <img src={loginTopWave} className="absolute left-0 top-0 h-96" />

      <div className="absolute left-20 top-16 flex items-center gap-6 xl:flex-col lg:hidden">
        <img src={logo} />
        <div className="font-bold">
          <h2 className="text-5xl">找打球</h2>
          <hr className="my-4 h-[3px] bg-secondary-dark" />
          <h3 className="text-4xl">管理系統</h3>
        </div>
      </div>

      <img
        src={leftCircle}
        alt=""
        className="absolute bottom-0 left-0 size-56"
      />

      <form
        className="relative z-10 flex flex-col gap-14 self-start border-t-4 border-light-blue bg-white px-12 py-8 shadow-xl"
        onSubmit={handleSubmit}
        style={{
          marginTop: ((document.documentElement.clientHeight - 414) / 5) * 3, // 414 height of form
        }}
      >
        <div className="font-bold">
          <h2 className="text-3xl">您好！</h2>
          <h3 className="text-2xl tracking-wider">歡迎您登入系統</h3>
        </div>

        <fieldset className="space-y-8">
          <Label className="flex items-baseline gap-5">
            帳號
            <Input
              className="w-64 rounded-none border-0 border-b border-b-secondary-dark sm:w-40"
              placeholder="請輸入帳號"
              name="account"
              required
              disabled={logginIn}
            />
          </Label>
          <Label className="relative flex items-baseline gap-5">
            密碼
            <Input
              className="w-64 rounded-none border-0 border-b border-b-secondary-dark sm:w-40"
              placeholder="請輸入密碼"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              disabled={logginIn}
            />
            <button
              className="absolute right-0 top-1/2 size-5 -translate-y-1/2 "
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img src={showPassword ? eye : eyeSlash} alt="" className="" />
            </button>
          </Label>
        </fieldset>

        <button
          className="border border-line-gray bg-light-gray py-3.5 transition-transform hover:bg-mid-gray active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-light-gray"
          disabled={logginIn}
        >
          登入
        </button>
      </form>

      <img
        src={rightCircle}
        alt=""
        className="absolute -right-10 top-24 size-56"
      />

      <img
        src={loginBottomWave}
        alt=""
        className="absolute bottom-0 right-0 h-36"
      />
    </div>
  );
};
export default Login;
