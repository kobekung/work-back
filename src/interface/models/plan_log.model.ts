import { IDefault } from "../default.interface";

export interface IPlanLog extends IDefault {
    id: number;
    planId?: number;
    updateDate?: Date;
    newName?: string;
    oldName?: string;
    newStartDate?: Date;
    newEndDate?: Date;
}