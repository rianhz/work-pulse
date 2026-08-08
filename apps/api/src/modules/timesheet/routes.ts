import { Router } from "express";
import { protectRoute } from "../../middleware/auth-middleware";
import { createTimesheetController, getTimesheetsController, getTimesheetController, updateTimesheetController, deleteTimesheetController } from "./controller";

export const timesheetRoutes = Router();

timesheetRoutes.post("/", protectRoute, createTimesheetController);
timesheetRoutes.get("/", protectRoute, getTimesheetsController);
timesheetRoutes.get("/:id", protectRoute, getTimesheetController);
timesheetRoutes.put("/:id", protectRoute, updateTimesheetController);
timesheetRoutes.delete("/:id", protectRoute, deleteTimesheetController);