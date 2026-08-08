import { Ability, AbilityBuilder, createMongoAbility, subject as caslSubject } from "@casl/ability";
import { ForbiddenException } from "./app-error";
import { AuthUser } from "../modules/authentication/interfaces";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "User" | "Project" | "Timesheet" | "Tenant" | "Invitation" | "Department" | "Position" | "Announcement" | "all";

export async function defineAbilitiesFor(user: AuthUser) {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  switch (user.role) {
    case "owner":
      can("manage", "User", { tenantId: user.tenantId });
      can("manage", "Project", { tenantId: user.tenantId });
      can("manage", "Timesheet", { tenantId: user.tenantId });
      can("manage", "Invitation", { tenantId: user.tenantId });
      can("manage", "Department", { tenantId: user.tenantId });
      can("manage", "Position", { tenantId: user.tenantId });

      can(["read", "update"], "Tenant", { _id: user.tenantId }); 

      can("manage", "Announcement", { tenantId: user.tenantId });
      break;

    case "admin":
      can("manage", "User", { tenantId: user.tenantId });
      can("manage", "Project", { tenantId: user.tenantId });
      can("manage", "Timesheet", { tenantId: user.tenantId });
      can("manage", "Invitation", { tenantId: user.tenantId });
      can("manage", "Department", { tenantId: user.tenantId });
      can("manage", "Position", { tenantId: user.tenantId });
      
      can(["read", "update"], "Tenant", { _id: user.tenantId }); 

      can("manage", "Announcement", { tenantId: user.tenantId });
      break;

    case "manager":
      can("manage", "Project", { tenantId: user.tenantId });
      can("read", "Project", { participants: { $in: [user.userId] } });
      can("read", "User", { tenantId: user.tenantId });
      can("read", "Department", { tenantId: user.tenantId });
      can("manage", "Timesheet", { userId: user.userId, tenantId: user.tenantId });

      can("read", "Announcement", { tenantId: user.tenantId });
      break;

    case "employee":
      can("read", "User", { _id: user.userId, tenantId: user.tenantId });
      can("update", "User", { _id: user.userId, tenantId: user.tenantId });
      can("read", "Project", { participants: { $in: [user.userId] } });
      can("manage", "Timesheet", { userId: user.userId, tenantId: user.tenantId });
      can("read", "Department", { tenantId: user.tenantId });

      can("read", "Announcement", { tenantId: user.tenantId });
      break;
  }

  return build();
}

export async function isHaveAccess(authenticatedUser: AuthUser, resourceData: any, subjectName: Subjects, action: Actions, field?: string) {
  const ability = await defineAbilitiesFor(authenticatedUser);

  const target = resourceData ? caslSubject(subjectName, JSON.parse(JSON.stringify(resourceData))) : subjectName;

  if (!ability.can(action, target, field)) {
    throw new ForbiddenException("You are not authorized to access this resource");
  }

  return true;
}