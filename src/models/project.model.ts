import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { IProject } from 'src/interface/models/project.model';
import { Member } from './member.model';
import { ProjectLog } from './project_log.model';

@Table({
  paranoid: true,
})
export class Project extends Model<Project | IProject> implements IProject {
  @Column({
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  startDate: Date;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  endDate: Date;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  type?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  unit?: string;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  status?: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  budgetYear?: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  ownerUnitId?: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  projectUnit?: string;

  @HasMany(() => Member, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  members?: Member[];

  @HasMany(() => ProjectLog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  logs?: ProjectLog[];
}
