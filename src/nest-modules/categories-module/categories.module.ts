import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { CreateCategoryUseCase } from '@core/category/application/use-case/create-category/create-category.use-case';
import { ICategoryRepository } from '@core/category/domain/category.repository';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: CategorySequelizeRepository,
      useFactory: (categoryModel: typeof CategoryModel) => {
        return new CategorySequelizeRepository(categoryModel);
      },
      inject: [getModelToken(CategoryModel)], //Pegar o nome da referencia em relacao a conexao com o banco de dados
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepo: ICategoryRepository) =>
        new CreateCategoryUseCase(categoryRepo),
      inject: [CategorySequelizeRepository]
    }
  ],
})
export class CategoriesModule {

  async xpto() {

  }
}
