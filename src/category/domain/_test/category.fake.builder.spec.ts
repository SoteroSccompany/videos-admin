import { Chance } from "chance";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { CategoryFakeBuilder } from "../category.fake.builder";
import { Category } from "../category.entity";



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

    describe("description prop", () => {

        const faker = CategoryFakeBuilder.aCategory();

        it("should be a function", () => {
            expect(typeof faker['_description']).toBe("function")
        });

        it("should call the paragraph method", () => {
            const chance = Chance();
            const spyParagraph = jest.spyOn(chance, 'paragraph');
            faker['chance'] = chance;
            faker.build();
            expect(spyParagraph).toHaveBeenCalled();
        });

        it("withDescription", () => {
            const description = "description test";
            const $this = faker.withDescription(description)
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this.description).toBe(description);
            faker.withDescription(() => description)
            expect($this.description).toBe(description)
        });

        it("should pass descriptionFactory", () => {
            const description = "Test description";
            const mockFunction = jest.fn(() => description);
            faker.withDescription(mockFunction)
            faker.build();
            expect(mockFunction).toHaveBeenCalledTimes(1)
            const fakeMany = CategoryFakeBuilder.theCategories(2).withDescription(mockFunction).build();
            expect(mockFunction).toHaveBeenCalledTimes(3)
            expect(fakeMany[0].description).toBe(description)
            expect(fakeMany[1].description).toBe(description)

        });
    })

    describe("activate and inactivate prop", () => {
        it('should desactivate category', () => {
            const faker = CategoryFakeBuilder.aCategory().build();
            expect(faker.is_active).toBe(true);
            faker.deactivate();
            expect(faker.is_active).toBe(false);
        });

        it('should active category', () => {
            const faker = CategoryFakeBuilder.aCategory().build();
            expect(faker.is_active).toBe(true);
            faker.deactivate();
            expect(faker.is_active).toBe(false);
            faker.activate();
            expect(faker.is_active).toBe(true)
        });


    });


    describe("CreatedAt prop", () => {

        const faker = CategoryFakeBuilder.aCategory();

        it("should createdAt at normal date", () => {
            const date = new Date();
            const $this = faker.withCreatedAt(date);
            expect($this.created_at).toBe(date);
            const date1 = new Date();
            faker.withCreatedAt(() => date1)
            expect($this.created_at).toBe(date1)
        });

        it("should createAt at factory date prop", () => {
            const date = new Date();
            const mockFunctionDate = jest.fn(() => date);
            faker.withCreatedAt(mockFunctionDate).build();
            expect(mockFunctionDate).toHaveBeenCalledTimes(1);
            const fakerMany = CategoryFakeBuilder.theCategories(3).withCreatedAt(mockFunctionDate).build();
            expect(mockFunctionDate).toHaveBeenCalledTimes(4)

        });


    });

    describe("With name too long", () => {
        const faker = CategoryFakeBuilder.aCategory();

        it("should generate name too long", () => {
            const $this = faker.withInvalidNameTooLong();
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            faker.build();
        })

        it("should call chance wor", () => {
            const chance = Chance();
            const spyOnChance = jest.spyOn(chance, 'word')
            faker['chance'] = chance;
            faker.build();
            expect(spyOnChance).toHaveBeenCalled();
        })

    });

    describe("With uuid", () => {
        const faker = CategoryFakeBuilder.aCategory();

        it("shuld pass uuid with text", () => {
            const uuid = new Uuid();
            const $this = faker.withUuid(uuid);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this.category_id).toBe(uuid);
            const uuid2 = new Uuid();
            faker.withUuid(() => uuid2);
            expect($this.category_id).toBe(uuid2)
        })

        it("should pass uuid with function", () => {
            const uuid = new Uuid();
            const mockFunctionUuid = jest.fn(() => uuid);
            const $this = faker.withUuid(mockFunctionUuid);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this.category_id).toBe(uuid);
        });

    });

    describe("build function", () => {
        it("should return instanceOf category with build", () => {
            const fake = CategoryFakeBuilder.aCategory();
            const spyOn = jest.spyOn(fake, 'build');
            const category = fake.build();
            expect(spyOn).toHaveBeenCalled();
            expect(category).toBeInstanceOf(Category);
        });
    });

    describe("With categoryId", () => {
        const faker = CategoryFakeBuilder.aCategory();

        it("shuld pass uuid with text", () => {
            const uuid = new Uuid();
            const $this = faker.withCategoryId(uuid);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this.category_id).toBe(uuid);
            const uuid2 = new Uuid();
            faker.withCategoryId(() => uuid2);
            expect($this.category_id).toBe(uuid2)
        })

        it("should pass uuid with function", () => {
            const uuid = new Uuid();
            const mockFunctionUuid = jest.fn(() => uuid);
            const $this = faker.withCategoryId(mockFunctionUuid);
            expect($this).toBeInstanceOf(CategoryFakeBuilder);
            expect($this.category_id).toBe(uuid);
        });

    });


});