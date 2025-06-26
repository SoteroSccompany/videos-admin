import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { CreateCategoryUseCase } from '@core/category/application/use-case/create-category/create-category.use-case';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from './categories.providers';

//Realizar a utilizacao do modulo para que seja utilizado no controller e realizar o post e o update
@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES)
  ],
})
export class CategoriesModule { }
