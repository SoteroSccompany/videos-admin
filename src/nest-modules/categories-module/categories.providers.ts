import { CreateCategoryUseCase } from "@core/category/application/use-case/create-category/create-category.use-case";
import { DeleteCategoryUseCase } from "@core/category/application/use-case/delete-category/delete-category.use-case";
import { GetCategoryUseCase } from "@core/category/application/use-case/get-category/get-category.use-case";
import { ListCategoriesUseCase } from "@core/category/application/use-case/list-categories/list-categories.use-case";
import { UpdateCategoryUseCase } from "@core/category/application/use-case/update-category/update-category.use-case";
import { ICategoryRepository } from "@core/category/domain/category.repository";
import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import { CategoryModel } from "@core/category/infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "@core/category/infra/db/sequelize/category.sequelize.repository";
import { getModelToken } from "@nestjs/sequelize";




export const REPOSITORIES = {
    CATEGORY_REPOSITORY: {
        provide: 'CategoryRepository', //Esse aqui sempre edeixa como o sequelize, caso queira no teste trocar, se utiliza o comentario acima de exemplo
        useExisting: CategorySequelizeRepository
    },
    CATEGORY_IN_MEMORY_REPOSITORIY: {
        provide: CategoryInMemoryRepository,
        useClass: CategoryInMemoryRepository //Nao precisa de ter dependencia externa, apenas instanciar a classe
    },
    CATEGORY_SEQUELIZE_REPOSITORY: {
        provide: CategorySequelizeRepository,
        useFactory: (categoryModel: typeof CategoryModel) => {
            return new CategorySequelizeRepository(categoryModel)
        },
        inject: [getModelToken(CategoryModel)]
    }
}


export const USE_CASES = {
    CREATE_CATEGORY: {
        provide: CreateCategoryUseCase,
        useFactory: (categoryRepository: ICategoryRepository) => {
            return new CreateCategoryUseCase(categoryRepository)
        },
        inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
    },
    UPDATE_CATEGORY: {
        provide: UpdateCategoryUseCase,
        useFactory: (categoryRepository: ICategoryRepository) => {
            return new UpdateCategoryUseCase(categoryRepository)
        },
        inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
    },
    DELETE_CATEGORY: {
        provide: DeleteCategoryUseCase,
        useFactory: (categoryRepository: ICategoryRepository) => {
            return new DeleteCategoryUseCase(categoryRepository)
        },
        inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
    },
    GET_CATEGORY: {
        provide: GetCategoryUseCase,
        useFactory: (categoryRepository: ICategoryRepository) => {
            return new GetCategoryUseCase(categoryRepository)
        },
        inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
    },
    LIST_CATEGORY: {
        provide: ListCategoriesUseCase,
        useFactory: (categoryRepository: ICategoryRepository) => {
            return new ListCategoriesUseCase(categoryRepository)
        },
        inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide]
    }

}

export const CATEGORY_PROVIDERS = {
    REPOSITORIES,
    USE_CASES
}