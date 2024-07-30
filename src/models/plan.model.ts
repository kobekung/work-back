import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IPlan } from 'src/interface/models/plan.model';
import { Project } from './project.model';

@Table({
  paranoid: true,
})
export class Plan extends Model<Plan | IPlan> implements IPlan {
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

  @ForeignKey(() => Project)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  projectId?: number;

  @BelongsTo(() => Project)
  project?: Project;
}
