import { IDefault } from "../default.interface";

export interface IPlanLog extends IDefault {
    id: number;
    planId?: number;
    newName?: string;
    oldName?: string;
    newStartDate?: Date;
    newEndDate?: Date;
}