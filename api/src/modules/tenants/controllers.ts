import { Request, Response, NextFunction } from 'express';
import { getTenant } from './services';

export const getTenantController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tenantId = (req as any).user.tenantId;
        const tenant = await getTenant(tenantId as string);
        res.status(200).json({ success: true, data: tenant });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};