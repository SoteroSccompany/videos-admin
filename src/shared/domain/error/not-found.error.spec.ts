import { Category } from "../../../category/domain/category.entity";
import { NotFoundError } from "./not-found.error";



describe("NotFound error teste", () => {

    it("should be instance of error", () => {
        const CategoryEntity = Category;
        const errorCategoryNotFound = new NotFoundError(CategoryEntity, ['123465'])

    });

});