import { Category } from "../../../category/domain/category.entity";
import { NotFoundError } from "./not-found.error";



describe("NotFound error teste", () => {

    it("should be instance of error", () => {
        const CategoryEntity = Category;
        const errorCategoryNotFound = new NotFoundError(['123465'], CategoryEntity)
        expect(errorCategoryNotFound).toBeInstanceOf(NotFoundError);
        expect(errorCategoryNotFound.message).toBe('Category. Not found using ID(s): 123465');
    });

});