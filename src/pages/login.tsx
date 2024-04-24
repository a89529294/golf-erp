import { useAuth } from "../hooks/use-auth";

const Login = () => {
  const { login } = useAuth();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({
      account: data.get("account") as string,
      password: data.get("password") as string,
    });
  };

  return (
    <div className="grid place-items-center gap-y-1 pt-40">
      login page
      <form
        className="flex flex-col items-center gap-1"
        onSubmit={handleSubmit}
      >
        <label className="flex w-80 justify-between">
          account:
          <input
            required
            name="account"
            type="text"
            className="border border-black"
          />
        </label>
        <label className="flex w-80 justify-between">
          password:
          <input
            required
            name="password"
            type="password"
            className="border border-black"
          />
        </label>
        <button
          type="submit"
          className="rounded-md border border-blue-300 px-10 py-2"
        >
          log in
        </button>
      </form>
    </div>
  );
};
export default Login;
