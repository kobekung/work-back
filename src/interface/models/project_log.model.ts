import { IDefault } from '../default.interface';

export interface IProjectLog extends IDefault {
  id: number;
  projectId: number;
  percent?: number;
  newName?: string;
  oldName?: string;
  newStartDate?: Date;
  newEndDate?: Date;
}
