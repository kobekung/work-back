import { IDefault } from "../default.interface";

export interface ITaskLog extends IDefault {
    id: number;
    taskId?: number;
    workerId?: number;
    updateDate?: Date;
    newName?: string;
    oldName?: string;
    newStartDate?: Date;
    newEndDate?: Date;
}