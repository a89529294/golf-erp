import { base_url, localStorageUserKey } from "@/utils";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";
import { privateFetch } from "@/utils/utils";

type AuthContextValue = {
  user: {
    account: string;
    permissions: string[];
    allowedStores: {
      ground: string[];
      golf: string[];
      simulator: string[];
    };
    expiresAt: number;
  } | null;
  login: (data: { account: string; password: string }) => Promise<unknown>;
  logout: () => void;
  isAuthenticated: boolean;
  clearUser: () => void;
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
    const response = await privateFetch(
      "/auth/login?populate=employee&populate=employee.stores",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const permissionsResponse = await privateFetch("/erp-features/me");
    const permissions = await permissionsResponse.json();
    const user = await response.json();

    const allowedStores = user.employee?.stores.reduce(
      (
        acc: { ground: string[]; golf: string[]; simulator: string[] },
        store: { id: string; category: "ground" | "golf" | "simulator" },
      ) => {
        acc[store.category].push(store.id);
        return acc;
      },
      {
        ground: [],
        golf: [],
        simulator: [],
      },
    ) ?? {
      ground: [],
      golf: [],
      simulator: [],
    };

    setUser({
      account: user.account,
      permissions: permissions.map((p: { name: string }) => p.name),
      allowedStores,
      expiresAt: new Date(user.expires).getTime() + 1000 * 60 * 60,
    });
    navigate("/", { replace: true });
  };

  const logout = useCallback(() => {
    fetch(`${base_url}/auth/logout`, {
      credentials: "include",
    });
    clearUser();
    navigate("/login", { replace: true });
  }, [clearUser, navigate]);

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
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
