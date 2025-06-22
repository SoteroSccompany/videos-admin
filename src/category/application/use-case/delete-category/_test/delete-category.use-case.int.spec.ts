import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.sequelize.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";




describe("DeleteCategoryUseCase Integration Tests", () => {

    setupSequelize({ models: [CategoryModel] });

    let useCase: DeleteCategoryUseCase;
    let repository: CategorySequelizeRepository;

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new DeleteCategoryUseCase(repository);
    });


    it("shold throw error when entity not found", async () => {
        const uuid = new Uuid();

        await expect(() =>
            useCase.execute({ id: uuid.id })
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));

    });

    it("should delete a category", async () => {
        const spyUpdate = jest.spyOn(repository, "delete");
        const entity = Category.fake().aCategory().withName("test").build();
        repository.insert(entity);
        let findItems = await repository.findAll();
        expect(findItems).toHaveLength(1);
        await useCase.execute({ id: entity.category_id.id });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        findItems = await repository.findAll();
        expect(findItems).toHaveLength(0);

    });



});