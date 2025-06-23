import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesModule } from './categories.module';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        CategoriesModule, //Registra o model no sequelize
      ], //Pode ser passado dessa forma
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {

    expect(controller).toBeDefined();
  });
});
