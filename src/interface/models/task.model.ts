import { IDefault } from "../default.interface";

export interface ITask extends IDefault {
    id: number;
    planId?: number;
    name?: string;
    startDate?: Date;
    endDate?: Date;
    status?: number;
}
