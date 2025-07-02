import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { CATEGORY_PROVIDERS } from './categories.providers';

//Realizar a utilizacao do modulo para que seja utilizado no controller e realizar o post e o update
@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    ...Object.values(CATEGORY_PROVIDERS.REPOSITORIES),
    ...Object.values(CATEGORY_PROVIDERS.USE_CASES)
  ],
  exports: [
    CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
  ]
})
export class CategoriesModule { }
