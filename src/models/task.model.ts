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
import { Comment } from './comment.model';

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

@Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  status: boolean;

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
    as: 'worker',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workers?: Worker[];

  // @HasMany(() => Comment, {
  //   as: 'comment',
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // comments?: Comment[];

  @BelongsTo(() => Plan)
  plan: Plan;
}
