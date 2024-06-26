import { useLoaderData, useOutlet } from "react-router-dom";
import { AuthProvider, User } from "../hooks/use-auth";
import { localStorageUserKey } from "@/utils";

const getUserData = (): User => {
  let user = JSON.parse(
    window.localStorage.getItem(localStorageUserKey) ?? "[]",
  );

  if (user === null || user.length === 0) user = null;
  return user;
};

export const AuthLayout = () => {
  const outlet = useOutlet();
  const user = useLoaderData() as User;

  return <AuthProvider userData={user}>{outlet}</AuthProvider>;
};

export const authLoader = () => {
  return getUserData();
};
