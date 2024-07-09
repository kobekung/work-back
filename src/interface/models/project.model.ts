import { PROJECT_UNIT_ENUM } from 'src/enum/project.unit.enum';
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
  projectUnitId?: number;
  logs?: IProjectLog[];
}

export interface IProjectTable {
  id: number;
  name: string;
  planCount?: number;
  taskCount?: number;
  progress?: number;
  memberCount?: number;
}
