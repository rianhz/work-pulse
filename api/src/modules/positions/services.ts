import { NotFoundException } from "../../utils/app-error";
import { IPosition } from "./interfaces";
import { PositionModel } from "./schema";

export const createPositionService = async (payload: IPosition): Promise<IPosition> => {
    const position = await PositionModel.create(payload);
    return position;
}

export const getPositionsService = async (tenantId: string): Promise<IPosition[]> => {
    const positions = await PositionModel.find({ tenantId, status: { $ne: 'deleted' } }).lean();
    if (!positions) {
        return [];
    }
    return positions;
}

export const getPositionService = async (id: string): Promise<IPosition> => {
    const position = await PositionModel.findById(id).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }
    return position;
}

export const updatePositionService = async (id: string, payload: IPosition): Promise<IPosition> => {
    const position = await PositionModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }
    return position;
}

export const deletePositionService = async (id: string): Promise<IPosition> => {
    const position = await PositionModel.findByIdAndUpdate(id, { status: 'deleted' }, { new: true }).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }
    return position;
}

export const disablePositionService = async (id: string): Promise<IPosition> => {
    const position = await PositionModel.findByIdAndUpdate(id, { status: 'disabled' }, { new: true }).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }
    return position;
}

export const enablePositionService = async (id: string): Promise<IPosition> => {
    const position = await PositionModel.findByIdAndUpdate(id, { status: 'active' }, { new: true }).lean();
    if (!position) {
        throw new NotFoundException('Position not found');
    }
    return position;
}