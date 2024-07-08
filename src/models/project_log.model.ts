import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { IProjectLog } from 'src/interface/models/project_log.model';
import { Project } from './project.model';

@Table({
  paranoid: true,
})
export class ProjectLog
  extends Model<ProjectLog | IProjectLog>
  implements IProjectLog
{
  @Column({
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => Project)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  projectId: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  newName?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  oldName?: string;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  newStartDate?: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  newEndDate?: Date;

  @BelongsTo(() => Project)
  project?: Project;
}
