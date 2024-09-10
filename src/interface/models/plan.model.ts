import { IDefault } from "../default.interface";

export interface IPlan extends IDefault {
    id: number;
    projectId?: number;
    name?: string;
    startDate?: Date;
    endDate?: Date;
}