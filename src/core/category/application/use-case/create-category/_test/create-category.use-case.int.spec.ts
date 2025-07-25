import { Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.sequelize.repository";
import { CreateCategoryInput } from "../create-category-input";
import { CreateCategoryUseCase } from "../create-category.use-case";





describe("CreateCategoryUseCase Integration Tests", () => {
    let useCase: CreateCategoryUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] })

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new CreateCategoryUseCase(repository);
    });


    it("Should create a category", async () => {
        let input = new CreateCategoryInput({ name: "test" })
        let output = await useCase.execute(input);
        let entity = await repository.findById(new Uuid(output.id));
        expect(output).toStrictEqual({
            id: entity.category_id.id,
            name: "test",
            description: null,
            is_active: true,
            created_at: entity.created_at,
        });

        output = await useCase.execute({
            name: "test",
            description: "some description",
            is_active: false,
        });
        entity = await repository.findById(new Uuid(output.id));
        expect(output).toStrictEqual({
            id: entity.category_id.id,
            name: "test",
            description: "some description",
            is_active: false,
            created_at: entity.created_at,
        });


    });

});