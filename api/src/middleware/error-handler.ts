import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../utils/http-config";
import { AppError, BadRequestException, ErrorCodes } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
): any => {
  console.log(`Error occurred: ${req.path}`, error);

  if (error.name === "ValidationError" && error.errors) {
    const requiredFields: string[] = [];
    const otherErrors: string[] = [];

    Object.keys(error.errors).forEach((key) => {
      const err = error.errors[key];
      if (err.kind === "required") {
        requiredFields.push(key);
      } else {
        otherErrors.push(err.message);
      }
    });

    const dynamicMessages: string[] = [];

    if (requiredFields.length > 0) {
      dynamicMessages.push(`The following fields are required: ${requiredFields.join(", ")}`);
    }

    if (otherErrors.length > 0) {
      dynamicMessages.push(...otherErrors);
    }

    const finalMessage = dynamicMessages.join(" | ");

    error = new BadRequestException(finalMessage);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Something went wrong",
    errorCode: ErrorCodes.ERR_INTERNAL,
  });
};