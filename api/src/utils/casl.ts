import { Ability, AbilityBuilder, createMongoAbility } from "@casl/ability";
import { UnauthorizedException } from "./app-error";
import { AuthUser } from "../modules/authentication/interfaces";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "User" | "Project" | "Timesheet" | "Tenant" | "all";

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
      break;

    case "manager":
      can("manage", "Project");
      can("manage", "Timesheet");
      break;

    case "employee":
      can("read", "Project");
      can("create", "Timesheet");
      can("read", "Timesheet");
      can("update", "Timesheet");
      break;
  }

  return build();
}

export async function isHaveAccess(authenticatedUser: AuthUser, targetTenantId: string, action: Actions, subject: Subjects, field?: string) {
  console.log("authenticatedUser.tenantId", authenticatedUser.tenantId);
  console.log("targetTenantId", targetTenantId);
  console.log("authenticatedUser.role", authenticatedUser.role);
  console.log("action", action);
  console.log("subject", subject);
  console.log("field", field);
  if (authenticatedUser.tenantId !== targetTenantId) {
    throw new UnauthorizedException("You are not authorized to access this resource");
  }
  const ability = await defineAbilitiesFor(authenticatedUser);
  if (!ability.can(action, subject, field)) {
    throw new UnauthorizedException("You are not authorized to perform this action");
  }

  return true;
}