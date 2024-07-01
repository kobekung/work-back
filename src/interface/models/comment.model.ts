import { IDefault } from "../default.interface";

export interface IComment extends IDefault {
    taskId?: number;
    userId?: number;
    comment?: string;
    img?: Blob;
}