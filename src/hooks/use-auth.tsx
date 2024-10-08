import { base_url, localStorageUserKey, navigateUponLogin } from "@/utils";
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
import { SimpleStore } from "@/utils/types";

type AuthContextValue = {
  user: {
    account: string;
    username: string;
    isAdmin: boolean;
    permissions: string[];
    allowedStores: {
      ground: SimpleStore[];
      golf: SimpleStore[];
      simulator: SimpleStore[];
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
    try {
      const response = await privateFetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const authPromises = [
        await privateFetch("/auth/permissions"),
        await privateFetch("/erp-features/me"),
      ];

      const auth = await Promise.all(authPromises);

      const isAdmin = (await auth[0].json()).includes("system:admin");
      const permissions = await auth[1].json();
      const user = await response.json();

      const allowedStores = user.employee?.stores.reduce(
        (
          acc: {
            ground: SimpleStore[];
            golf: SimpleStore[];
            simulator: SimpleStore[];
          },
          store: {
            id: string;
            category: "ground" | "golf" | "simulator";
            name: string;
            county: string;
            district: string;
            address: string;
            merchantId: string;
          },
        ) => {
          acc[store.category].push({
            id: store.id,
            name: store.name,
            county: store.county,
            district: store.district,
            address: store.address,
            merchantId: store.merchantId,
          });
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

      const permissionsStringArr = permissions.map(
        (p: { name: string }) => p.name,
      );

      setUser({
        account: user.account,
        username: user.username,
        isAdmin,
        permissions: permissionsStringArr,
        allowedStores,
        expiresAt: new Date(user.expires).getTime() + 1000 * 60 * 60,
      });

      navigateUponLogin(permissionsStringArr, navigate);
      // navigate("/", { replace: true });
    } catch (e) {
      console.log(e);

      throw new Error("login failed");
    }
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

    // logout();
  }, [isAuthenticated, clearUser, logout]);

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
