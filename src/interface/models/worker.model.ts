import { IDefault } from "../default.interface";

export interface IWorker extends IDefault {
    id: number;
    taskId?: number;
    userId?: number;
    createDate?: Date;
}