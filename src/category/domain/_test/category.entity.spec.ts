import { EntityValidationError } from "../../../shared/domain/validators/validation.errors";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { Category } from "../category.entity";



describe("Category Unit Tests", () => {
    let validateSpy: any;
    beforeEach(() => {
        validateSpy = jest.spyOn(Category, "validate");
    });


    describe("constructor", () => {


        test("should create a category with default values", () => {
            //@ts-ignore
            const category = new Category({
                name: "Movie"
            });
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
        });

        test("should create a category with all values", () => {
            const created_at = new Date();

            //@ts-ignore
            const category = new Category({
                name: "Movie",
                description: "description",
                is_active: false,
                created_at
            });

            expect(category.category_id).toBeInstanceOf(Uuid);;
            expect(category.name).toBe("Movie");
            expect(category.description).toBe("description");
            expect(category.is_active).toBe(false);
            expect(category.created_at).toBe(created_at);

        });
    });

    describe("create command", () => {

        test("shound create a category", () => {
            const input = { name: "Movie" };
            const category = Category.create(input);
            expect(category.category_id).toBeInstanceOf(Uuid);;
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("Should create a category with description", () => {
            const input = { name: "Movie", description: "description" };
            const category = Category.create(input);
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Movie");
            expect(category.description).toBe("description");
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("Should create a category with is_active", () => {
            const input = { name: "Movie", is_active: false };
            const category = Category.create(input);
            expect(category.category_id).toBeInstanceOf(Uuid);;
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBe(false);
            expect(category.created_at).toBeInstanceOf(Date);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });


        describe("category_id field", () => {
            const arrange = [
                { category_id: null }, { category_id: undefined }, { category_id: new Uuid() }
            ]
            test.each(arrange)('category_id = %j', ({ category_id }) => {
                const input = { name: "Movie", category_id: category_id as any };
                const category = Category.create(input);
                expect(category.category_id).toBeInstanceOf(Uuid);
                if (category_id instanceof Uuid) {
                    expect(category.category_id).toBe(category_id);
                }
            });
        });


        test("Should change name", () => {
            const input = { name: "Movie" };
            const category = Category.create(input);
            category.changeName("New Movie");
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("New Movie");
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test("Should change description", () => {
            const input = { name: "Movie" };
            const category = Category.create(input);
            expect(category.description).toBeNull();
            category.changeDescription("New description");
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Movie");
            expect(category.description).toBe("New description");
            expect(validateSpy).toHaveBeenCalledTimes(2);
        });

        test("Should activate category", () => {
            const input = { name: "Movie", is_active: false };
            const category = Category.create(input);
            expect(category.is_active).toBe(false);
            category.activate();
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Movie");
            expect(category.is_active).toBe(true);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("Should deactivate category", () => {
            const input = { name: "Movie", is_active: true };
            const category = Category.create(input);
            expect(category.is_active).toBe(true);
            category.deactivate();
            expect(category.category_id).toBeInstanceOf(Uuid);
            expect(category.name).toBe("Movie");
            expect(category.is_active).toBe(false);
            expect(validateSpy).toHaveBeenCalledTimes(1);
        });

        test("Should convert to json", () => {
            const input = { name: "Movie", is_active: true };
            const category = Category.create(input);
            const json = category.toJson();
            expect(json.category_id).toBe(category.category_id.id);
            expect(json.name).toBe("Movie");
            expect(json.description).toBeNull();
            expect(json.is_active).toBe(true);
            expect(json.created_at).toBeInstanceOf(Date);
        });



    })

});

describe("CategoryValidator", () => {

    describe("create command", () => {

        test("should an invalid category with name property", () => {

            expect(() => Category.create({ name: null })).containsErrorMessages({
                name: [
                    "name should not be empty",
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters",
                ]
            })

            expect(() => Category.create({ name: "" })).containsErrorMessages({
                name: [
                    "name should not be empty"
                ]
            })

            expect(() => Category.create({ name: 5 as any })).containsErrorMessages({
                name: [
                    "name must be a string",
                    "name must be shorter than or equal to 255 characters"
                ]
            })

            expect(() => Category.create({ name: "t".repeat(256) })).containsErrorMessages({
                name: [
                    "name must be shorter than or equal to 255 characters"
                ]
            })

        });

    });



});