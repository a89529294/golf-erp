import { base_url, localStorageUserKey } from "@/utils";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";
import { privateFetch } from "@/utils/utils";

type AuthContextValue = {
  user: {
    account: string;
    permissions: string[];
    expiresAt: number;
  } | null;
  login: (data: { account: string; password: string }) => Promise<unknown>;
  logout: () => void;
  isAuthenticated: boolean;
};

export type User = AuthContextValue["user"];
type LoginData = Parameters<AuthContextValue["login"]>[0];

const AuthContext = createContext({} as AuthContextValue);

export const AuthProvider = ({
  children,
  userData,
}: {
  children: ReactNode;
  userData: User;
}) => {
  const [user, setUser, clearUser] = useLocalStorage(
    localStorageUserKey,
    userData,
  );
  const navigate = useNavigate();

  const login = async (data: LoginData) => {
    const response = await privateFetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const permissionsResponse = await privateFetch("/erp-features/me");
    const permissions = await permissionsResponse.json();
    const user = await response.json();

    setUser({
      account: user.account,
      permissions: permissions.map((p: { name: string }) => p.name),
      expiresAt: Date.now() + 1000 * 60 * 60,
    });
    navigate("/", { replace: true });
  };

  const logout = () => {
    fetch(`${base_url}/auth/logout`, {
      credentials: "include",
    });
    clearUser();
    navigate("/login", { replace: true });
  };

  const isAuthenticated = !!(
    localStorage.getItem(localStorageUserKey) &&
    user &&
    user.expiresAt > Date.now()
  );

  useEffect(() => {
    if (!isAuthenticated) clearUser();
  }, [isAuthenticated, clearUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
