import { Column, DataType, Model, Table } from "sequelize-typescript";
import { IMember } from "src/interface/models/member.model";

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
}
