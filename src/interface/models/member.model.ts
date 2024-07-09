import { IDefault } from "../default.interface";

export interface IMember extends IDefault {
    id: number;
    projectId: number;
    userId?: number;
    roleId?: number;
    status?: number;
    senderId?: number;
}