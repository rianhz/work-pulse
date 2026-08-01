import express from "express";
import { getLeaveRequests, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest, getMyLeaveRequests } from "./controllers";
import { protectRoute } from "../../../middleware/auth-middleware";

const leaveRequestsRoutes = express.Router();

leaveRequestsRoutes.get("/requests", protectRoute, getLeaveRequests);
leaveRequestsRoutes.post("/requests", protectRoute, createLeaveRequest);
leaveRequestsRoutes.get("/requests/me", protectRoute, getMyLeaveRequests);
leaveRequestsRoutes.put("/requests/:id", protectRoute, updateLeaveRequest);
leaveRequestsRoutes.delete("/requests/:id", protectRoute, deleteLeaveRequest);

export default leaveRequestsRoutes;