import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { IUser } from 'src/interface/models/user.model';
import { Worker } from './worker.model';

@Table({
  paranoid: true,
})
export class User extends Model<User | IUser> implements IUser {
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
    unique: true,
  })
  idp: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  lastName: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  token?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  refreshToken?: string;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  socketId?: string;

  @HasMany(() => Worker, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  workers?: Worker[];
}
