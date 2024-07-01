import { IDefault } from "../default.interface";

export interface IRole extends IDefault {
    id: number;
    name: string;
    isEditPlan?: boolean;
    isEditProject?: boolean;
    isEditTask?: boolean;
}