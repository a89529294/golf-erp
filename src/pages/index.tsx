import { useAuth } from "../hooks/use-auth";

export default function Index() {
  const { logout } = useAuth();

  return (
    <div className="grid place-items-center gap-1 pt-40">
      index page
      <button onClick={logout} className="border border-blue-300 px-10 py-2">
        log out
      </button>
    </div>
  );
}
