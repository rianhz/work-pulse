import { Ability, AbilityBuilder, createMongoAbility, subject as caslSubject } from "@casl/ability";
import { ForbiddenException, UnauthorizedException } from "./app-error";
import { AuthUser } from "../modules/authentication/interfaces";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "User" | "Project" | "Timesheet" | "Tenant" | "Invitation" | "all";

export async function defineAbilitiesFor(user: AuthUser) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  switch (user.role) {
    case "owner":
      can("manage", "all");
      break;

    case "admin":
      can("manage", "User");
      can("manage", "Project");
      can("manage", "Timesheet");
      can("manage", "Tenant");
      can("manage", "Invitation");
      break;

    case "manager":
      can("manage", "Project");
      can("manage", "Timesheet");
      can("read", "User");
      break;

    case "employee":
      can("read", "User", { id: user.userId });
      can("update", "User", { id: user.userId });
      can("read", "Project");
      can("create", "Timesheet");
      can("read", "Timesheet");
      can("update", "Timesheet");
      break;
  }

  return build();
}

export async function isHaveAccess(authenticatedUser: AuthUser, resourceData: any, subjectName: Subjects, action: Actions, field?: string) {
  console.log("authenticatedUser", authenticatedUser);
  console.log("resourceData", resourceData);
  console.log("subjectName", subjectName);
  console.log("action", action);
  console.log("field", field);
  const ability = await defineAbilitiesFor(authenticatedUser);

  const target = resourceData ? caslSubject(subjectName, resourceData) : subjectName;

  if (!ability.can(action, target, field)) {
    throw new ForbiddenException("You are not authorized to access this resource");
  }

  return true;
}