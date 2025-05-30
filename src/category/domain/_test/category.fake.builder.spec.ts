import { Chance } from "chance";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { CategoryFakeBuilder } from "../category.fake.builder";



describe('CategoryFakeBuilder Unit Test', () => {

    describe("category_id prop", () => {

        const faker = CategoryFakeBuilder.aCategory();

        it("should throw an error when any with method is called", () => {
            expect(() => faker.category_id).toThrow(
                new Error("Property category_id not have a factory, use 'with' methods")
            );
        }
        );

        it("should be undefined", () => {
            expect(faker['_category_id']).toBeUndefined();
        });

        it("withUuid", () => {
            const category_id = new Uuid();
            const $this = faker.withUuid(category_id);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_category_id']).toBe(category_id);

            faker.withUuid(() => category_id);
            expect(faker.category_id).toBe(category_id);
        })


        it("should pass category_id factory", () => {
            const mockFactory = jest.fn(() => new Uuid());
            faker.withUuid(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledTimes(1);

            const category_id = new Uuid();
            mockFactory.mockReturnValue(category_id);
            const fakerMany = CategoryFakeBuilder.theCategories(2).withUuid(mockFactory).build();
            expect(mockFactory).toHaveBeenCalledTimes(3);

            expect(fakerMany[0].category_id).toBe(category_id);
            expect(fakerMany[1].category_id).toBe(category_id);
        });


    });

    describe("name prop", () => {

        const faker = CategoryFakeBuilder.aCategory();

        it("should be a function", () => {
            expect(typeof faker['_name']).toBe("function");
        }
        );

        it("should call the word method", () => {
            const chance = Chance();
            const spyWord = jest.spyOn(chance, 'word');
            faker['chance'] = chance;
            faker.build();
            expect(spyWord).toHaveBeenCalledWith();
        });

        it("withName", () => {
            const name = "Category Name";
            const $this = faker.withName(name);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect(faker['_name']).toBe(name);

            faker.withName(() => name);
            expect(faker.name).toBe(name);
        });

        it("should pass name factory", () => {
            const mockFactory = jest.fn(() => "Category Name");
            faker.withName(mockFactory);
            faker.build();
            expect(mockFactory).toHaveBeenCalledTimes(1);

            const name = "Another Category Name";
            mockFactory.mockReturnValue(name);
            const fakerMany = CategoryFakeBuilder.theCategories(2).withName(mockFactory).build();
            expect(mockFactory).toHaveBeenCalledTimes(3);

            expect(fakerMany[0].name).toBe(name);
            expect(fakerMany[1].name).toBe(name);
        });
    });

});