import { instanceToPlain, plainToInstance } from "class-transformer";
import { CategoryCollectionPresenter, CategoryPresenter } from "./category-presenter";
import { PaginationPresenter } from "../shared-module/pagination.presenter";



describe("CategoryPresenter Unit test", () => {

    let input = { id: "Id", name: "name", description: "description", is_active: true, created_at: new Date() }

    describe("CategoryPresenter", () => {


        it("should create categoryPresenter class", () => {
            const presenter = new CategoryPresenter(input);

            expect(presenter).toBeInstanceOf(CategoryPresenter);
            expect(presenter.id).toBe(input.id)
            expect(presenter.name).toBe(input.name)
            expect(presenter.description).toBe(input.description)
            expect(presenter.is_active).toBe(input.is_active)
            expect(presenter.created_at).toBeInstanceOf(Date)
            expect(presenter.created_at).toEqual(input.created_at)
            expect(() => new Date(presenter.created_at)).not.toThrow();

            expect(instanceToPlain(presenter)).toStrictEqual({
                id: input.id,
                name: input.name,
                description: input.description,
                is_active: input.is_active,
                created_at: input.created_at.toISOString(),
            });

        });



    });

    describe("CategoryCollectionPresenter", () => {
        let input1 = { ...input, id: "id1" };
        let input2 = { ...input, id: "id2" };
        let input3 = { ...input, id: "id3" };
        const inputs = [input1, input2, input3];

        it("should create a collection with correct data", () => {
            const colletionPresenter = new CategoryCollectionPresenter({
                items: inputs,
                current_page: 1,
                per_page: 10,
                last_page: 1,
                total: 3
            })
            colletionPresenter.data.forEach((item, index) => {
                expect(item).toBeInstanceOf(CategoryPresenter);
                expect(item.id).toBe(inputs[index].id);
                expect(item.name).toBe(inputs[index].name);
                expect(item.description).toBe(inputs[index].description);
                expect(item.is_active).toBe(inputs[index].is_active);
                expect(item.created_at).toBeInstanceOf(Date);
                expect(item.created_at).toEqual(inputs[index].created_at);
                expect(() => new Date(item.created_at)).not.toThrow();
            });

            expect(instanceToPlain(colletionPresenter)).toStrictEqual({
                data: inputs.map((i) => ({
                    ...i,
                    created_at: i.created_at.toISOString(),
                })),
                meta: {
                    current_page: 1,
                    per_page: 10,
                    last_page: 1,
                    total: 3,
                }
            });

            expect(colletionPresenter.meta).toBeInstanceOf(PaginationPresenter);
            expect(colletionPresenter.meta.current_page).toBe(1);
            expect(colletionPresenter.meta.per_page).toBe(10);
            expect(colletionPresenter.meta.last_page).toBe(1);
            expect(colletionPresenter.meta.total).toBe(3);
            expect(colletionPresenter.data).toHaveLength(3);
            expect(colletionPresenter.data[0]).toBeInstanceOf(CategoryPresenter);
            expect(colletionPresenter.data[1]).toBeInstanceOf(CategoryPresenter);
            expect(colletionPresenter.data[2]).toBeInstanceOf(CategoryPresenter);
        });
    });

});