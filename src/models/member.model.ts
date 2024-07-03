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

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  projectId: number;

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

  @Column({
    allowNull: true,
    type: DataType.INTEGER,
  })
  status?: number;

  @BelongsTo(() => Role)
  role?: Role;
}
