import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";



export type CastMemberModelProps = {
    cast_member_id: string;
    name: string;
    cast_member_type: number;
    created_at: Date
}

@Table({ tableName: "cast_member", timestamps: false })
export class CastMemberModel extends Model<CastMemberModelProps> {

    @PrimaryKey
    @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
    declare cast_member_id: string; // UUID

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare cast_member_type: number;

    @Column({ type: DataType.DATE(3), allowNull: false })
    declare created_at: Date;

}



