import express from "express";
import { updateLeaveBalanceController, getLeaveBalanceController, getMyLeaveBalanceController } from "./controllers";
import { protectRoute } from "../../../middleware/auth-middleware";

const leaveBalanceRoutes = express.Router();

leaveBalanceRoutes.put("/balance", protectRoute, updateLeaveBalanceController);
leaveBalanceRoutes.get("/balance/me", protectRoute, getMyLeaveBalanceController);
leaveBalanceRoutes.get("/balance/:userId", protectRoute, getLeaveBalanceController);

export default leaveBalanceRoutes;