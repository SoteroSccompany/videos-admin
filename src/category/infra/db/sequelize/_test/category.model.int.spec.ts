import { DataType, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryFakeBuilder } from "../../../../domain/category.fake.builder";
import { before } from "lodash";


describe('CategoryModel Integration Tests', () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [CategoryModel],
            logging: false,
        })
        await sequelize.sync({ force: true });
    });

    it('mapping props', async () => {
        const attributesMap = CategoryModel.getAttributes();
        const atributes = Object.keys(attributesMap);
        expect(atributes).toStrictEqual([
            'category_id',
            'name',
            'description',
            'is_active',
            'created_at'
        ]);

        const categoryIdAttr = attributesMap.category_id;
        expect(categoryIdAttr).toMatchObject({
            type: DataType.UUID(),
            field: 'category_id',
            fieldName: 'category_id',
            primaryKey: true,
        });

        const nameAttr = attributesMap.name;
        expect(nameAttr).toMatchObject({
            type: DataType.STRING(255),
            field: 'name',
            fieldName: 'name',
            allowNull: false,
        });

        const descriptionAttr = attributesMap.description;
        expect(descriptionAttr).toMatchObject({
            type: DataType.TEXT(),
            field: 'description',
            fieldName: 'description',
            allowNull: true,
        });

        const isActiveAttr = attributesMap.is_active;
        expect(isActiveAttr).toMatchObject({
            type: DataType.BOOLEAN(),
            field: 'is_active',
            fieldName: 'is_active',
            allowNull: false,
            defaultValue: true,
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
            category_id: "f8b1c2d3-4e5f-6a7b-8c9d-e0f1g2h3i4j5",
            name: "Category 1",
            description: "Description of Category 1",
            is_active: true,
            created_at: new Date(),
        }
        //Act
        const category = await CategoryModel.create(arrange);
        //Assert
        expect(category.toJSON()).toStrictEqual(arrange);
    });



})