import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Member } from './member.model';
import { IComment } from 'src/interface/models/comment.model';
import { User } from './user.model';
import { Task } from './task.model';

@Table({
  paranoid: true,
})
export class Comment extends Model<Comment | IComment> implements IComment {
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
  comment: string;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  userId?: number;

  @ForeignKey(() => Task)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  taskId?: number;

  @BelongsTo(() => Task)
  task?: Task;

  @BelongsTo(() => User)
  user?: User;
}
