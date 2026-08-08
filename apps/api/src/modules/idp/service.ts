import { NotFoundException } from "../../utils/app-error";
import { IIdentity } from "./interfaces";
import { IdentityModel } from "./schema";

export const getIdentityService = async (userId: string): Promise<IIdentity[]> => {
    const identity = await IdentityModel.find({ userId });
    if (!identity) throw new NotFoundException('Identity not found');
    return identity;
};