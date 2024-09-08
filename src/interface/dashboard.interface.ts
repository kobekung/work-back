import { IProject } from './models/project.model';

export interface IDashboard {
  success: number;
  pending: number;
  onprogress: number;
  total: number;
  projects: IProject[];
}
