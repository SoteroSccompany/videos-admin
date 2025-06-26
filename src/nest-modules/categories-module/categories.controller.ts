import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { CreateCategoryUseCase } from '@core/category/application/use-case/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-case/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-case/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-case/get-category/get-category.use-case';
import { ListCategoriesUseCase, ListCategoryUseCaseInput } from '@core/category/application/use-case/list-categories/list-categories.use-case';
import { CreateCategoryInput } from '@core/category/application/use-case/create-category/create-category-input';

@Controller('categories')
export class CategoriesController {

  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    this.createUseCase.execute(createCategoryDto)
  }

  @Get()
  findAll() { }

  @Get(':id')
  findOne(@Param('id') id: string) { }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) { }

  @Delete(':id')
  remove(@Param('id') id: string) { }
}
