import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model {

    @PrimaryKey
    @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
    declare category_id: string; // UUID

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare description: string | null;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    declare is_active: boolean;

    @Column({ type: DataType.DATE(3), allowNull: false })
    declare created_at: Date;




}