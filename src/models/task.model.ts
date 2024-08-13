import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ITask } from 'src/interface/models/task.model';
import { Plan } from './plan.model';
import { TaskLog } from './task_log.model';
import { Worker } from './worker.model';

@Table({
  paranoid: true,
})
export class Task extends Model<Task | ITask> implements ITask {
  @Column({
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  startDate: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  endDate: Date;

  @ForeignKey(() => Plan)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  planId?: number;

  @HasMany(() => TaskLog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  taskLogs?: TaskLog[];

  @HasMany(() => Worker, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workers?: Worker[];
  
  @BelongsTo(() => Plan)
  plan: Plan;
}
