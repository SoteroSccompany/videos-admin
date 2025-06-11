import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../../get-category.use-case";




describe("GetCategoryUseCase Unit Tests", () => {
    let useCase: GetCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
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
        repository.items = [entity];
        const output = await useCase.execute({ id: entity.category_id.id });
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: repository.items[0].category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: repository.items[0].created_at,
        });

    });



});