import { IDefault } from '../default.interface';
import { IProjectLog } from './project_log.model';

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
  projectUnit?: string;
  logs?: IProjectLog[];
}
