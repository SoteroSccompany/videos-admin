import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import { CategoryModel } from "@core/category/infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "@core/category/infra/db/sequelize/category.sequelize.repository";
import { getModelToken } from "@nestjs/sequelize";



export const REPOSITORIES = {
    CATEGORY_REPOSITORY: {
        provide: 'CategoryRepository',
        useExisting: CategorySequelizeRepository
    },
    CATEGORY_IN_MEMORY_REPOSITORIY: {
        provide: CategoryInMemoryRepository,
        useClass: CategoryInMemoryRepository
    },
    CATEGORY_SEQUELIZE_REPOSITORY: {
        provide: CategorySequelizeRepository,
        useFactory: (categoryModel: typeof CategoryModel) => {
            return new CategorySequelizeRepository(categoryModel)
        },
        inject: [getModelToken(CategoryModel)]
    }
}