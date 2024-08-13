import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { ITaskLog } from 'src/interface/models/task_log.model';
import { Task } from './task.model';

@Table({
  paranoid: true,
})
export class TaskLog extends Model<TaskLog | ITaskLog> implements ITaskLog {
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
  newName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  updateTask: string;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  newStartDate: Date;

  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  newEndDate?: Date;

  @ForeignKey(() => Task)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  taskId?: number;

  @BelongsTo(() => Task)
  task: Task;
}
