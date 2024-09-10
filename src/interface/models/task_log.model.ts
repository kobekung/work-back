import { IDefault } from '../default.interface';

export interface ITaskLog extends IDefault {
  id: number;
  taskId?: number;
  updateTask?: string;
  workerId?: number;
  newName?: string;
  newStartDate?: Date;
  newEndDate?: Date;
}
