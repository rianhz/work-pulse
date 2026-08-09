import express from "express";
import { getLeaveRequests, createLeaveRequest, updateLeaveRequest, deleteLeaveRequest, getMyLeaveRequests, getLeaveRequestById, rejectLeaveRequest, approveLeaveRequest } from "./controllers";
import { protectRoute } from "../../../middleware/auth-middleware";

const leaveRequestsRoutes = express.Router();

leaveRequestsRoutes.get("/requests", protectRoute, getLeaveRequests);
leaveRequestsRoutes.post("/requests", protectRoute, createLeaveRequest);
leaveRequestsRoutes.get("/requests/me", protectRoute, getMyLeaveRequests);
leaveRequestsRoutes.get("/requests/:id", protectRoute, getLeaveRequestById);
leaveRequestsRoutes.put("/requests/:id", protectRoute, updateLeaveRequest);
leaveRequestsRoutes.delete("/requests/:id", protectRoute, deleteLeaveRequest);
leaveRequestsRoutes.put("/requests/:id/approve", protectRoute, approveLeaveRequest);
leaveRequestsRoutes.put("/requests/:id/reject", protectRoute, rejectLeaveRequest);

export default leaveRequestsRoutes;