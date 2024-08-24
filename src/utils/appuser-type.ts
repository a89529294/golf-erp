import { AppUserType } from "@/constants/appuser-type.ts";

export function appUserTypeNameOf(type: string) {
  const name = {
    [AppUserType.Guest]: "來賓",
    [AppUserType.CommonUser]: "一般會員",
    [AppUserType.GroupUser]: "團體會員",
    [AppUserType.Coach]: "教練",
    [AppUserType.Collaboration]: "協力廠商",
  }[type];

  if (!name) {
    throw new Error(`Unknown AppUser-Type: "${type}"`);
  }

  return name;
}
