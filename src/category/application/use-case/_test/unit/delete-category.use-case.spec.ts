import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";




describe("DeleteCategoryUseCase Unit Tests", () => {
    let useCase: DeleteCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new DeleteCategoryUseCase(repository);
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

    it("should delete a category", async () => {
        const spyUpdate = jest.spyOn(repository, "delete");
        const entity = Category.fake().aCategory().withName("test").build();
        repository.items = [entity];
        await useCase.execute({ id: entity.category_id.id });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(repository.items).toHaveLength(0);

    });



});