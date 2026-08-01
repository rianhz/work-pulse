import { AbilityBuilder, createMongoAbility, AnyMongoAbility, subject as caslSubject } from "@casl/ability";
import { ForbiddenException } from "./app-error";
import { AuthUser } from "../modules/authentication/interfaces";

export type Actions = "manage" | "create" | "read" | "update" | "delete";
export type Subjects = "User" | "Project" | "Timesheet" | "Tenant" | "Invitation" | "Department" | "Position" | "Announcement" | "LeaveRequest" | "LeaveBalance" | "all";

// Relax subject conditions typing to avoid verbose interface definitions
export type AppAbility = AnyMongoAbility;

export function defineAbilitiesFor(user: AuthUser): AppAbility {
  const { can, build, cannot } = new AbilityBuilder<AnyMongoAbility>(createMongoAbility);

  switch (user.role) {
    case "owner":
    case "admin":
      can("manage", "User", { tenantId: user.tenantId });
      can("manage", "Project", { tenantId: user.tenantId });
      can("manage", "Timesheet", { tenantId: user.tenantId });
      can("manage", "Invitation", { tenantId: user.tenantId });
      can("manage", "Department", { tenantId: user.tenantId });
      can("manage", "Position", { tenantId: user.tenantId });
      can("manage", "Tenant", { tenantId: user.tenantId }); 
      can("manage", "Announcement", { tenantId: user.tenantId });
      can("manage", "LeaveBalance", { tenantId: user.tenantId });
      can("manage", "LeaveRequest", { tenantId: user.tenantId });
      break;

    case "manager":
      can("read", "User", { tenantId: user.tenantId });
      can("read", "Department", { tenantId: user.tenantId });

      can("manage", "Project", { tenantId: user.tenantId });
      can("manage", "Timesheet", { userId: user.userId, tenantId: user.tenantId });
      can("read", "Announcement", { tenantId: user.tenantId });
      can("read", "LeaveBalance", { userId: user.userId, tenantId: user.tenantId });

      can("manage", "LeaveRequest", { userId: user.userId, tenantId: user.tenantId });
      cannot("update", "LeaveRequest", ["status"], { userId: user.userId, tenantId: user.tenantId });

      // Manager managing ANY leave request within their tenant (CAN update status)
      can(["read", "update"], "LeaveRequest", { tenantId: user.tenantId });
      break;

    case "employee":
      can("read", "User", { userId: user.userId, tenantId: user.tenantId });
      can("update", "User", { userId: user.userId, tenantId: user.tenantId });
      can("read", "User", { leader: user.userId, tenantId: user.tenantId });

      can("read", "Project", { participants: { $in: [user.userId] }, tenantId: user.tenantId });
      can("manage", "Timesheet", { userId: user.userId, tenantId: user.tenantId });
      can("read", "Department", { tenantId: user.tenantId });

      can("read", "Announcement", { tenantId: user.tenantId });
      can("read", "LeaveBalance", { userId: user.userId, tenantId: user.tenantId });

      // 1. Employee managing their own request (CANNOT update 'status')
      can("manage", "LeaveRequest", { userId: user.userId, tenantId: user.tenantId });
      cannot("update", "LeaveRequest", ["status"], { userId: user.userId, tenantId: user.tenantId });

      // 2. Employee acting as a LEADER for someone else's request (CAN update 'status')
      can(["read", "update"], "LeaveRequest", { leader: user.userId, tenantId: user.tenantId });
      break;
  }

  return build();
}

export async function isHaveAccess(
  authenticatedUser: AuthUser, 
  subjectName: Subjects, 
  action: Actions, 
  resourceData?: any, 
  field?: string
): Promise<boolean> {
  const ability = defineAbilitiesFor(authenticatedUser);

  const targetData = resourceData ?? { 
    userId: authenticatedUser.userId, 
    tenantId: authenticatedUser.tenantId 
  };

  const target = caslSubject(subjectName, JSON.parse(JSON.stringify(targetData)));

  if (!ability.can(action, target, field)) {
    throw new ForbiddenException("You are not authorized to access this resource");
  }

  return true;
}