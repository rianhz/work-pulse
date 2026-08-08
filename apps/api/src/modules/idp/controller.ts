import { Request, Response } from "express";
import { HTTPSTATUS } from "../../utils/http-config";
import { asyncHandler } from "../../middleware/async-handler";
import { getIdentityService } from "./service";

// export const getIdentityController = asyncHandler(async (req: Request, res: Response) => {
//     const { userId } = (req as any).user;
//     const identity = await getIdentityService(userId);
//     res.status(HTTPSTATUS.OK).json({ success: true, data: identity });
// });