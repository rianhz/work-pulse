import { Types } from "mongoose";
import { UserModel } from "../modules/users/schema";
import { ForbiddenException, NotFoundException } from "../utils/app-error";

/**
 * Returns an array of User ObjectIds accessible to the target user based on role hierarchy.
 * - Admin / Owner: returns null (meaning "all users, no filter required")
 * - Employee / Manager: returns leader ID, user ID, and all recursive subordinates
 */
export const getAccessibleUserIds = async (
  userId: string,
  role: string,
  tenantId: string
): Promise<Types.ObjectId[] | null> => {
  // Admins & Owners see everything in the tenant
  if (role === "admin" || role === "owner") {
    return null;
  }

  if (role !== "employee" && role !== "manager") {
    throw new ForbiddenException("Invalid role mapping.");
  }

  const userObjectId = new Types.ObjectId(userId);

  // Aggregation pipeline to fetch leader + recursively gather down-tree subordinates
  const [result] = await UserModel.aggregate([
    {
      $match: {
        _id: userObjectId,
        tenantId,
        status: { $ne: "deleted" },
      },
    },
    {
      $graphLookup: {
        from: "users",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "leader",
        as: "subordinates",
        restrictSearchWithMatch: {
          tenantId,
          status: { $ne: "deleted" },
        },
      },
    },
    {
      $project: {
        leader: 1,
        subordinateIds: "$subordinates._id",
      },
    },
  ]);

  if (!result) {
    throw new NotFoundException("User not found.");
  }

  const accessibleIds = new Set<string>();

  // 1. Include self
  accessibleIds.add(userId);

  // 2. Include upward leader (if exists)
  if (result.leader) {
    accessibleIds.add(result.leader.toString());
  }

  // 3. Include all downward subordinates
  if (Array.isArray(result.subordinateIds)) {
    result.subordinateIds.forEach((id: Types.ObjectId) =>
      accessibleIds.add(id.toString())
    );
  }

  return Array.from(accessibleIds).map((id) => new Types.ObjectId(id));
};

/**
 * Traverses UPWARD from a given user to collect all direct and indirect leaders
 * up to the top of the organization hierarchy (e.g., Manager -> Director -> CEO).
 * 
 * @param userId - The target user ID to start traversing from
 * @param tenantId - The tenant boundary
 * @param includeSelf - Whether to include the input userId in the returned array (default: false)
 * @returns Array of ObjectIds representing the management chain (bottom-to-top)
 */
export const getManagementChainUserIds = async (
  userId: string,
  tenantId: string,
  includeSelf: boolean = false
): Promise<Types.ObjectId[]> => {
  const userObjectId = new Types.ObjectId(userId);

  const [result] = await UserModel.aggregate([
    {
      $match: {
        _id: userObjectId,
        tenantId,
        status: { $ne: "deleted" },
      },
    },
    {
      $graphLookup: {
        from: "users", // Must be the raw collection name (lowercase & pluralized)
        startWith: "$leader", // Start with the immediate leader's ID
        connectFromField: "leader", // On found leaders, grab their leader field
        connectToField: "_id", // Match it against another user's _id
        as: "managementChain",
        restrictSearchWithMatch: {
          tenantId,
          status: { $ne: "deleted" },
        },
      },
    },
    {
      $project: {
        chainIds: "$managementChain._id",
      },
    },
  ]);

  if (!result) {
    throw new NotFoundException("User not found.");
  }

  const leaderIds: Types.ObjectId[] = result.chainIds || [];

  if (includeSelf) {
    leaderIds.unshift(userObjectId);
  }

  return leaderIds;
};

/**
 * Retrieves the immediate direct leader (1 level up) for a given user.
 * 
 * @param userId - The ID of the employee whose leader you want to find
 * @param tenantId - The tenant boundary
 * @returns The leader's ObjectId, or null if the user has no leader
 */
export const getImmediateLeaderUserId = async (
  userId: string,
  tenantId: string
): Promise<Types.ObjectId | null> => {
  const user = await UserModel.findOne({
    _id: userId,
    tenantId,
    status: { $ne: "deleted" },
  })
    .select("leader")
    .lean();

  if (!user) {
    throw new NotFoundException("User not found.");
  }

  return user.leader ? new Types.ObjectId(user.leader.toString()) : null;
};