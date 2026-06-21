import { isHaveAccess } from "../../utils/casl";
import { HTTPSTATUS } from "../../utils/http-config";
import { createPositionService, deletePositionService, disablePositionService, enablePositionService, getPositionService, getPositionsService, updatePositionService } from "./services";
import { Request, Response } from "express";

export const createPositionController = async (req: Request, res: Response) => {
    const { name } = req.body;
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;
    await isHaveAccess(authenticatedUser, null, "Position", "manage");
    const position = await createPositionService({ name, tenantId, status: 'active' });
    res.status(HTTPSTATUS.CREATED).json({ success: true });
}

export const getPositionsController = async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    const { tenantId } = authenticatedUser;
    await isHaveAccess(authenticatedUser, null, "Position", "manage");
    const positions = await getPositionsService(tenantId);
    res.status(HTTPSTATUS.OK).json({ success: true, data: positions });
}

export const getPositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  const { tenantId } = authenticatedUser;
  await isHaveAccess(authenticatedUser, null, "Position", "manage");
  const position = await getPositionService(id as string);
  res.status(HTTPSTATUS.OK).json({ success: true, data: position });
}

export const updatePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const authenticatedUser = (req as any).user;
  const { tenantId } = authenticatedUser;
  await isHaveAccess(authenticatedUser, null, "Position", "manage");
  const position = await updatePositionService(id as string, { name, status, tenantId });
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const deletePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  await isHaveAccess(authenticatedUser, null, "Position", "manage");
  const position = await deletePositionService(id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const disablePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  await isHaveAccess(authenticatedUser, null, "Position", "manage");
  const position = await disablePositionService(id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const enablePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  await isHaveAccess(authenticatedUser, null, "Position", "manage");
  const position = await enablePositionService(id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}