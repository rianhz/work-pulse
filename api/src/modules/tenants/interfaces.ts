import { IProject } from "../projects/interfaces";
export interface ITenant {
    _id: string;
    name: string;
    slug: string;
    description: string;
    plan: string;
    status: string;
    projects: IProject[];
}