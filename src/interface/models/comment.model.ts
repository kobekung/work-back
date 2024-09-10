import { IDefault } from '../default.interface';
import { ITask } from './task.model';
import { IUser } from './user.model';

export interface IComment extends IDefault {
  taskId?: number;
  userId?: number;
  comment?: string;
  task?: ITask;
  user?: IUser;
}
