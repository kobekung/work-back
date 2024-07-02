import { IDefault } from "../default.interface";

export interface ITaskLog extends IDefault {
    id: number;
    taskId?: number;
    workerId?: number;
    newName?: string;
    oldName?: string;
    newStartDate?: Date;
    newEndDate?: Date;
}