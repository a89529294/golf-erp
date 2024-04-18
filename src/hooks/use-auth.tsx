import { ReactNode, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./use-local-storage";

type AuthContextValue = {
  user: {
    email: string;
    role: string;
  } | null;
  login: (data: { email: string; password: string }) => Promise<unknown>;
  logout: () => void;
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
  const [user, setUser, clearUser] = useLocalStorage("user", userData);
  const navigate = useNavigate();

  const login = async (data: LoginData) => {
    let user;
    if (data.email === "admin@example.com") {
      user = {
        email: data.email,
        role: "admin",
      };
    } else {
      user = {
        email: data.email,
        role: "customer",
      };
    }

    setUser(user);
    navigate("/", { replace: true });
  };

  const logout = () => {
    clearUser();
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
