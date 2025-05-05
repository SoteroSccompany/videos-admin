import { Category } from "../category.entity";



describe("Category Unit Tests", () => {


    describe("constructor", () => {


        test("should create a category with default values", () => {
            //@ts-ignore
            const category = new Category({
                name: "Movie"
            });
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.updated_at).toBeInstanceOf(Date);
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

            expect(category.category_id).toBeUndefined();
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
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.updated_at).toBeInstanceOf(Date);
        });

        test("Should create a category with description", () => {
            const input = { name: "Movie", description: "description" };
            const category = Category.create(input);
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.description).toBe("description");
            expect(category.is_active).toBeTruthy();
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.updated_at).toBeInstanceOf(Date);
        });

        test("Should create a category with is_active", () => {
            const input = { name: "Movie", is_active: false };
            const category = Category.create(input);
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.description).toBeNull();
            expect(category.is_active).toBe(false);
            expect(category.created_at).toBeInstanceOf(Date);
            expect(category.updated_at).toBeInstanceOf(Date);
        });

        test("Should change name", () => {
            const input = { name: "Movie" };
            const category = Category.create(input);
            category.changeName("New Movie");
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("New Movie");
        });

        test("Should change description", () => {
            const input = { name: "Movie" };
            const category = Category.create(input);
            expect(category.description).toBeNull();
            category.changeDescription("New description");
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.description).toBe("New description");
        });

        test("Should activate category", () => {
            const input = { name: "Movie", is_active: false };
            const category = Category.create(input);
            expect(category.is_active).toBe(false);
            category.activate();
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.is_active).toBe(true);
        });

        test("Should deactivate category", () => {
            const input = { name: "Movie", is_active: true };
            const category = Category.create(input);
            expect(category.is_active).toBe(true);
            category.deactivate();
            expect(category.category_id).toBeUndefined();
            expect(category.name).toBe("Movie");
            expect(category.is_active).toBe(false);
        });

        test("Should convert to json", () => {
            const input = { name: "Movie", is_active: true };
            const category = Category.create(input);
            const json = category.toJson();
            expect(json.category_id).toBeUndefined();
            expect(json.name).toBe("Movie");
            expect(json.description).toBeNull();
            expect(json.is_active).toBe(true);
            expect(json.created_at).toBeInstanceOf(Date);
            expect(json.updated_at).toBeInstanceOf(Date);
        });



    })

});