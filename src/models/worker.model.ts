import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Task } from './task.model';
import { IWorker } from 'src/interface/models/worker.model';
import { User } from './user.model';

@Table({
  paranoid: true,
})
export class Worker extends Model<Worker | IWorker> implements IWorker {
  @Column({
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId?: number;

  @BelongsTo(() => User)
  user?: User;

  @ForeignKey(() => Task)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  taskId?: number;

  @BelongsTo(() => Task)
  task?: Task;
}
