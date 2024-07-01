import { Table, Model, Column, DataType } from "sequelize-typescript";
import { IProject } from "src/interface/models/project.model";

@Table({
    paranoid: true,
})
export class Project extends Model<Project | IProject> implements IProject {
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
        allowNull: false,
        type: DataType.DATE,
    })
    startDate: Date;

    @Column({
        allowNull: false,
        type: DataType.DATE,
    })
    endDate: Date;

    @Column({
        allowNull: true,
        type: DataType.NUMBER,
    })
    type?: number;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    unit?: string;

    @Column({
        allowNull: true,
        type: DataType.NUMBER,
    })
    status?: number;

    @Column({
        allowNull: true,
        type: DataType.NUMBER,
    })
    budgetYear?: number;

    @Column({
        allowNull: false,
        type: DataType.NUMBER,
    })
    ownerUnitId: number;
}