import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { IMember } from 'src/interface/models/member.model';
import { Role } from './role.model';
import { Project } from './project.model';
import { User } from './user.model';

@Table({
  paranoid: true,
})
export class Member extends Model<Member | IMember> implements IMember {
  @Column({
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id: number;

  @ForeignKey(() => Project)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  projectId: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId: number;

  @ForeignKey(() => Role)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  roleId?: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  senderId?: number;

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  status?: number;

  @BelongsTo(() => Role)
  role?: Role;

  @BelongsTo(() => Project)
  project?: Project;

  @BelongsTo(() => User)
  user?: User;

  @BelongsTo(() => User , 'senderId')
  sender?: User;
}
