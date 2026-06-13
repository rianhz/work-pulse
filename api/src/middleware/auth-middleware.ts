import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../helpers/auth-helper";
import { 
  ACCESS_COOKIE_OPTIONS, 
  ACCESS_TOKEN_EXPIRES_IN, 
  ACCESS_TOKEN_SECRET, 
  REFRESH_COOKIE_OPTIONS, 
  REFRESH_TOKEN_EXPIRES_IN, 
  REFRESH_TOKEN_SECRET 
} from "../utils/constant";
import { UserModel } from "../modules/users/schema";
import { compareValue, hashValue } from "../utils/bcrypt";

export const protectRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        
        console.log("--- protectRoute Hook Triggered ---");
        console.log("Received Access Token:", !!accessToken);
        console.log("Received Refresh Token:", !!refreshToken);

        if (accessToken) {
            try {
                const decoded = jwt.verify(
                    accessToken,
                    ACCESS_TOKEN_SECRET
                ) as JwtPayload;

                (req as any).user = decoded;
                return next();

            } catch (error: any) {
                if (error.name !== "TokenExpiredError") {
                    res.status(401).json({
                        success: false,
                        message: "Invalid access token structure",
                    });
                    return;
                }
                console.log("Access Token expired. Dropping down to refresh validation...");
            }
        }

        if (!refreshToken) {
            res.status(401).json({
                success: false,
                message: "Session expired. Refresh token missing",
            });
            return;
        }

        const decodedRefresh = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET
        ) as JwtPayload;

        const userId = decodedRefresh.userId.toString();
        const tenantId = decodedRefresh.tenantId.toString();

        if (!userId) {
            console.error("Payload Extraction Failed. No clear user identification found.");
            res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
            res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
            res.status(401).json({ success: false, message: "Malformed session credentials" });
            return;
        }

        const user = await UserModel.findById(userId);

        if (!user || !user.refreshToken?.token) {
            res.status(401).json({
                success: false,
                message: "User session not found or revoked",
            });
            return;
        }


        const isRefreshTokenMatch = await compareValue(
            refreshToken,
            user.refreshToken.token
        );

        console.log("isRefreshTokenMatch", isRefreshTokenMatch);


        if (!isRefreshTokenMatch) {
            await UserModel.findByIdAndUpdate(userId, {
                $set: { refreshToken: {
                    token: null,
                    expiresIn: null,
                    createdAt: null,
                } },
            });

            res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
            res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

            res.status(401).json({
                success: false,
                message: "Invalid session token security match",
            });
            return;
        }

        const newAccessToken = generateAccessToken(
            { userId: userId.toString(), tenantId: tenantId },
            ACCESS_TOKEN_EXPIRES_IN
        );

        const newRefreshToken = generateRefreshToken(
            { userId: userId.toString(), tenantId: tenantId },
            REFRESH_TOKEN_EXPIRES_IN
        );

        const hashedRefreshToken = await hashValue(newRefreshToken, 10);

        await UserModel.findByIdAndUpdate(userId, {
            $set: {
                refreshToken: {
                    token: hashedRefreshToken,
                    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
                    createdAt: new Date(),
                },
            },
        });

        res.cookie("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);
        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

        (req as any).user = { userId: userId.toString(), tenantId: tenantId };
        console.log("Tokens cycled successfully mid-flight! Forwarding request details.");
        next();
    } catch (error) {
        console.error("Fatal protectRoute breakdown crash:", error);

        // CRUCIAL: Pass options object configurations down to clear HttpOnly attributes correctly
        res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
        res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);

        res.status(401).json({
            success: false,
            message: "Unauthorized session tracking collapse",
        });
    }
};