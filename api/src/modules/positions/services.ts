import { NotFoundException, ForbiddenException } from "../../utils/app-error";
import { IPosition } from "./interfaces";
import { PositionModel } from "./schema";
import { AuthUser } from "../authentication/interfaces";
import { isHaveAccess } from "../../utils/casl";

export const createPositionService = async (authenticatedUser: AuthUser, payload: Partial<IPosition>): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const position = await PositionModel.create({
        ...payload,
        tenantId: authenticatedUser.tenantId,
        status: 'active'
    });
    return position;
}

export const getPositionsService = async (authenticatedUser: AuthUser): Promise<IPosition[]> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const positions = await PositionModel.find({ 
        tenantId: authenticatedUser.tenantId, 
        status: { $ne: 'deleted' } 
    }).lean();
    
    return positions || [];
}

export const getPositionService = async (authenticatedUser: AuthUser, id: string): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const position = await PositionModel.findById(id).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }

    if (position.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException('You do not have access to this position');
    }

    return position;
}

export const updatePositionService = async (authenticatedUser: AuthUser, id: string, payload: Partial<IPosition>): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const existingPosition = await PositionModel.findById(id).lean();
    if (!existingPosition) throw new NotFoundException('Position not found');
    
    if (existingPosition.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException('You do not have access to modify this position');
    }

    const position = await PositionModel.findByIdAndUpdate(
        id, 
        { name: payload.name, status: payload.status },
        { new: true }
    ).lean();

    return position!;
}

export const deletePositionService = async (authenticatedUser: AuthUser, id: string): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const existingPosition = await PositionModel.findById(id).lean();
    if (!existingPosition) throw new NotFoundException('Position not found');
    
    if (existingPosition.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException('You cannot delete this position');
    }

    const position = await PositionModel.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).lean();
    return position!;
}

export const disablePositionService = async (authenticatedUser: AuthUser, id: string): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const existingPosition = await PositionModel.findById(id).lean();
    if (!existingPosition) throw new NotFoundException('Position not found');
    
    if (existingPosition.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException('You cannot disable this position');
    }

    const position = await PositionModel.findByIdAndUpdate(id, { status: 'disabled' }, { new: true }).lean();
    return position!;
}

export const enablePositionService = async (authenticatedUser: AuthUser, id: string): Promise<IPosition> => {
    await isHaveAccess(authenticatedUser, null, "Position", "manage");

    const existingPosition = await PositionModel.findById(id).lean();
    if (!existingPosition) throw new NotFoundException('Position not found');
    
    if (existingPosition.tenantId !== authenticatedUser.tenantId && authenticatedUser.role !== "owner") {
        throw new ForbiddenException('You cannot enable this position');
    }

    const position = await PositionModel.findByIdAndUpdate(id, { status: 'active' }, { new: true }).lean();
    return position!;
}