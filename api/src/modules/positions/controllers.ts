import { HTTPSTATUS } from "../../utils/http-config";
import { createPositionService, deletePositionService, disablePositionService, enablePositionService, getPositionService, getPositionsService, updatePositionService } from "./services";
import { Request, Response } from "express";

export const createPositionController = async (req: Request, res: Response) => {
    const { name } = req.body;
    const authenticatedUser = (req as any).user;
    
    await createPositionService(authenticatedUser, { name });
    res.status(HTTPSTATUS.CREATED).json({ success: true });
}

export const getPositionsController = async (req: Request, res: Response) => {
    const authenticatedUser = (req as any).user;
    
    const positions = await getPositionsService(authenticatedUser);
    res.status(HTTPSTATUS.OK).json({ success: true, data: positions });
}

export const getPositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  
  const position = await getPositionService(authenticatedUser, id as string);
  res.status(HTTPSTATUS.OK).json({ success: true, data: position });
}

export const updatePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body;
  const authenticatedUser = (req as any).user;
  
  await updatePositionService(authenticatedUser, id as string, { name, status });
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const deletePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  
  await deletePositionService(authenticatedUser, id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const disablePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  
  await disablePositionService(authenticatedUser, id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}

export const enablePositionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authenticatedUser = (req as any).user;
  
  await enablePositionService(authenticatedUser, id as string);
  res.status(HTTPSTATUS.OK).json({ success: true });
}