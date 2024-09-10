import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import { IProject } from 'src/interface/models/project.model';
import { Member } from './member.model';
import { ProjectLog } from './project_log.model';
import { PROJECT_UNIT_ENUM } from 'src/enum/project.unit.enum';
import { IProjectUnit } from 'src/interface/models/project_unit.model';
import { Project } from './project.model';

@Table({
  paranoid: true,
})
export class ProjectUnit extends Model<ProjectUnit | IProjectUnit> implements IProjectUnit {
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

  @HasMany(() => Project, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Projects?: Project[];
}
