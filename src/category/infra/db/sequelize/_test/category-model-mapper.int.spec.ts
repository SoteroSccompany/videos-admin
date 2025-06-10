import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.errors";
import { Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../../domain/category.entity";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";





describe('CategoryModelMapper Integration Tests', () => {

    setupSequelize({ models: [CategoryModel] });

    it("should throw an error when entity is invalid", () => {
        const model = CategoryModel.build({
            category_id: new Uuid().id,
        });
        try {
            CategoryModelMapper.toEntity(model);
            fail("The category is valid, but it needs throws a EntityValidationError");
        } catch (error) {
            expect(error).toBeInstanceOf(EntityValidationError);
            expect((error as EntityValidationError).errors).toMatchObject(
                {
                    name: [
                        "name should not be empty",
                        "name must be a string",
                        "name must be shorter than or equal to 255 characters",
                    ],
                }
            );
        }
    });

    it("should convert a category model to a category aggregate", () => {
        const created_at = new Date();
        const model = CategoryModel.build({
            category_id: new Uuid().id,
            name: "Movie",
            description: "description",
            is_active: false,
            created_at,
        });
        const entity = CategoryModelMapper.toEntity(model);
        expect(entity.toJson()).toStrictEqual({
            category_id: model.category_id,
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        })
    });


    it("should convert a category aggregate to a category model", () => {
        const entity = Category.fake().aCategory().build();
        const model = CategoryModelMapper.toModel(entity);
        expect(model.toJSON()).toStrictEqual({
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        });
    });


})