import { IDefault } from '../default.interface';

export interface IProject extends IDefault {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  type?: number;
  unit?: string;
  status?: number;
  budgetYear?: number;
  ownerUnitId?: number;
}
