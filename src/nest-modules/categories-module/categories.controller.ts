import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, HttpCode, Query } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category.sequelize.repository';
import { CreateCategoryUseCase } from '@core/category/application/use-case/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-case/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-case/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-case/get-category/get-category.use-case';
import { ListCategoriesUseCase, ListCategoryUseCaseInput } from '@core/category/application/use-case/list-categories/list-categories.use-case';
import { CategoryCollectionPresenter, CategoryPresenter } from './category-presenter';
import { CategoryOutput } from '@core/category/application/use-case/common/category-output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

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
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto)
    return CategoriesController.serialize(output);
  }

  @Get()
  async search(
    @Query() searchParamsDto: SearchCategoriesDto
  ) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new CategoryCollectionPresenter(output);

  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.serialize(output)
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id
    })
    return CategoriesController.serialize(output)
  }

  @HttpCode(204) //Para retornar quando nao precisar de um codigo
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    return this.deleteUseCase.execute({ id })
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
