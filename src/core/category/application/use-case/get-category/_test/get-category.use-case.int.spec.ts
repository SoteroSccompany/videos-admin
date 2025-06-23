import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.sequelize.repository";
import { GetCategoryUseCase } from "../get-category.use-case";




describe("GetCategoryUseCase Integration Tests", () => {
    setupSequelize({ models: [CategoryModel] });

    let useCase: GetCategoryUseCase;
    let repository: CategorySequelizeRepository;

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new GetCategoryUseCase(repository);
    });


    it("shold throw error when entity not found", async () => {
        await expect(() =>
            useCase.execute({ id: "fake id" })
        ).rejects.toThrow("Invalid UUID: fake id");

        const uuid = new Uuid();

        await expect(() =>
            useCase.execute({ id: uuid.id })
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));

    });

    it("should get a category", async () => {
        const spyUpdate = jest.spyOn(repository, "findById");
        const entity = Category.fake().aCategory().withName("test").build();
        repository.insert(entity);
        let findItems = await repository.findAll();
        expect(findItems).toHaveLength(1);
        const output = await useCase.execute({ id: entity.category_id.id });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        });

    });



});