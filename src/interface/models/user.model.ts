import { IDefault } from "../default.interface";

export interface IUser extends IDefault {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    refreshToken?: string;
}