import { DataType, Sequelize } from "sequelize-typescript";
import { before } from "lodash";
import { Config } from "../../../../../shared/infra/config";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CastMemberModel } from "../cast-member.model";


describe('CastMemberModel Integration Tests', () => {

    setupSequelize({ models: [CastMemberModel] });

    it('mapping props', async () => {
        const attributesMap = CastMemberModel.getAttributes();
        const atributes = Object.keys(attributesMap);
        expect(atributes).toStrictEqual([
            'cast_member_id',
            'name',
            'cast_member_type',
            'created_at'
        ]);

        const categoryIdAttr = attributesMap.cast_member_id;
        expect(categoryIdAttr).toMatchObject({
            type: DataType.UUID(),
            field: 'cast_member_id',
            fieldName: 'cast_member_id',
            primaryKey: true,
        });

        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            type: DataType.STRING(255),
            field: 'name',
            fieldName: 'name',
            allowNull: false,
        });

        const descriptionAttr = attributesMap.cast_member_type;
        expect(descriptionAttr).toMatchObject({
            type: DataType.INTEGER(),
            field: 'cast_member_type',
            fieldName: 'cast_member_type',
            allowNull: false,
        });

        const createdAtAttr = attributesMap.created_at;
        expect(createdAtAttr).toMatchObject({
            type: DataType.DATE(3),
            field: 'created_at',
            fieldName: 'created_at',
            allowNull: false,
        });
    });

    it("create", async () => {
        //Arrange
        const arrange = {
            cast_member_id: "f8b1c2d3-4e5f-6a7b-8c9d-e0f1g2h3i4j5",
            name: "CastMember 1",
            cast_member_type: 1,
            created_at: new Date(),
        }
        //Act
        const castMember = await CastMemberModel.create(arrange);
        //Assert
        expect(castMember.toJSON()).toStrictEqual(arrange);
    });



})