import { Column, DataType, Model, Table } from "sequelize-typescript";
import { IProjectLog } from "src/interface/models/project_log.model";

@Table({
    paranoid: true,
})
export class ProjectLog extends Model<ProjectLog | IProjectLog> implements IProjectLog {
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
        type: DataType.DATE,
    })
    updateDate: Date;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    newName?: string;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    oldName?: string;

    @Column({
        allowNull: true,
        type: DataType.DATE,
    })
    newStartDate?: Date;

    @Column({
        allowNull: true,
        type: DataType.DATE,
    })
    newEndDate?: Date;
}