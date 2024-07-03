import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { IRole } from 'src/interface/models/role.model';
import { Member } from './member.model';

@Table({
  paranoid: true,
})
export class Role extends Model<Role | IRole> implements IRole {
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
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  isEditPlan?: boolean;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  isEditProject?: boolean;

  @Column({
    allowNull: true,
    type: DataType.BOOLEAN,
  })
  isEditTask?: boolean;

  @HasMany(() => Member, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  members?: Member[];
}
