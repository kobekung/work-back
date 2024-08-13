import { IDefault } from '../default.interface';
import { ITaskLog } from './task_log.model';

export interface ITask extends IDefault {
  id: number;
  planId?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  status?: number;
  taskLogs?: ITaskLog[];
}
