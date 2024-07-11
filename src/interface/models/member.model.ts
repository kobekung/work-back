import { IDefault } from '../default.interface';
import { IProject } from './project.model';
import { IRole } from './role.model';
import { IUser } from './user.model';

export interface IMember extends IDefault {
  id: number;
  projectId: number;
  userId: number;
  roleId?: number;
  senderId?: number;
  status?: number;
  project?: IProject;
  user?: IUser;
  role?: IRole;
  sender?: IUser;
}
