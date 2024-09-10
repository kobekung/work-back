import { IDefault } from '../default.interface';

export interface IProjectUnit extends IDefault {
  id: number;
  name: string;
  token?:string;
}
