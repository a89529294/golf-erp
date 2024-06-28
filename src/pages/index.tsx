import { useAuth } from "../hooks/use-auth";

export default function Index() {
  const { logout } = useAuth();

  return (
    <div className="grid w-full place-items-center gap-1 ">
      <div>
        <h1 className="text-center">index page</h1>
        <button onClick={logout} className="border border-blue-300 px-10 py-2">
          log out
        </button>
      </div>
    </div>
  );
}
