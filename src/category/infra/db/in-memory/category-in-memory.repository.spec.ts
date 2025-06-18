import { Category } from "../../../domain/category.entity";
import { CategoryFakeBuilder } from "../../../domain/category.fake.builder";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";



describe("CategoryInMemoryRepository", () => {

    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
    });

    it("should no filter items when filter object is null", async () => {
        const items = [CategoryFakeBuilder.aCategory().build()];
        const filterSpy = jest.spyOn(items, "filter" as any);
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applyFilter"](items, null);
        expect(itemsFiltered).toStrictEqual(items);
        expect(filterSpy).not.toHaveBeenCalled();
    });

    it("should no filter items when using filter", async () => {
        const items = [
            CategoryFakeBuilder.aCategory().withName("Category 1").build(),
            CategoryFakeBuilder.aCategory().withName("Category 2").build(),
            CategoryFakeBuilder.aCategory().withName("Category 3").build(),
        ];
        const filterSpy = jest.spyOn(items, "filter" as any);
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applyFilter"](items, "Category 1");
        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered[0]).toStrictEqual(items[0]);
    });

    it("should sort by created_at when sort is null", async () => {
        const created_at = new Date();

        const items = [
            CategoryFakeBuilder.aCategory().withName("Category 1").withCreatedAt(created_at).build(),
            CategoryFakeBuilder.aCategory().withName("Category 2").withCreatedAt(new Date(created_at.getTime() + 100)).build(),
            CategoryFakeBuilder.aCategory().withName("Category 3").withCreatedAt(new Date(created_at.getTime() + 200)).build(),
        ];
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applySort"](items, null, null);
        expect(itemsFiltered).toStrictEqual([
            items[2],
            items[1],
            items[0]
        ]);
    });

    it("should sort by name when sort is name", async () => {
        const items = [
            CategoryFakeBuilder.aCategory().withName("A").build(),
            CategoryFakeBuilder.aCategory().withName("B").build(),
            CategoryFakeBuilder.aCategory().withName("C").build(),
        ];
        await repository.bulkInsert(items);
        let itemsFiltered = await repository["applySort"](items, "name", "asc");
        expect(itemsFiltered).toStrictEqual([
            items[0],
            items[1],
            items[2]
        ]);
        itemsFiltered = await repository["applySort"](items, "name", "desc");
        expect(itemsFiltered).toStrictEqual([
            items[2],
            items[1],
            items[0]
        ]);

    });

    it("should create category by getEntity", () => {
        const spyGetEntity = jest.spyOn(repository, 'getEntity');
        const CategoryEntity = repository.getEntity();
        const category = new CategoryEntity({ name: "teste" });
        expect(category).toBeInstanceOf(Category);
        expect(spyGetEntity).toHaveBeenCalled();

    });




});