import { Category } from "../../domain/category.entity";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";



describe("CategoryInMemoryRepository", () => {

    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
    });

    it("should no filter items when filter object is null", async () => {
        const items = [
            new Category({ name: "Category 1" }),
            new Category({ name: "Category 2" }),
            new Category({ name: "Category 3" }),
        ];
        const filterSpy = jest.spyOn(items, "filter" as any);
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applyFilter"](items, null);
        expect(itemsFiltered).toStrictEqual(items);
        expect(filterSpy).not.toHaveBeenCalled();
    });

    it("should no filter items when using filter", async () => {
        const items = [
            new Category({ name: "Category 1" }),
            new Category({ name: "Category 2" }),
            new Category({ name: "Category 3" }),
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
            new Category({ name: "Category 1", created_at }),
            new Category({ name: "Category 2", created_at: new Date(created_at.getTime() + 100) }),
            new Category({ name: "Category 3", created_at: new Date(created_at.getTime() + 200) }),
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
            new Category({ name: "A" }),
            new Category({ name: "B" }),
            new Category({ name: "C" }),
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


});