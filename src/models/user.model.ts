import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { IUser } from 'src/interface/models/user.model';

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
}

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
