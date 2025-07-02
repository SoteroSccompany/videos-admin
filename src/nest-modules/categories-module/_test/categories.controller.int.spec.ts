
import { CategoriesController } from '../categories.controller';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { CategoriesModule } from '../categories.module';
import { CATEGORY_PROVIDERS } from '../categories.providers';
import { CreateCategoryUseCase } from '@core/category/application/use-case/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-case/update-category/update-category.use-case';
import { ListCategoriesUseCase } from '@core/category/application/use-case/list-categories/list-categories.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-case/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-case/delete-category/delete-category.use-case';
import { CreateCategoryFixture, UpdateCategoryFixture } from '../testing/category.fixture';
import { Uuid } from '@core/shared/domain/value-objects/uui.vo';
import { CategoryOutputMapper } from '@core/category/application/use-case/common/category-output';
import { CategoryPresenter } from '../category-presenter';
import { Category } from '@core/category/domain/category.entity';

describe('CategoriesController Integration Tests', () => {

  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();
    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<ICategoryRepository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
    );

  });

  /*
      Aqui esta sendo inserido dentro do banco de dados, está sendo uzado para salvar dados, etc...
  */

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListCategoriesUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
  });

  describe("should create a category", () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();
    //Se consegue pegar o send_data pela string colocando a notacao de dolar antes, como no exemplo abaixo:
    it.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data as any);
        const entity = await repository.findById(new Uuid(presenter.id))
        const { id, created_at, ...otherProps } = presenter;
        expect(entity.toJson()).toStrictEqual({
          category_id: id,
          created_at: created_at,
          ...otherProps
        });
        const output = CategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CategoryPresenter(output));
      }
    );

  });

  describe("should update a category", () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate();

    const category = Category.fake().aCategory().build();

    beforeEach(async () => {
      await repository.insert(category);
    });

    afterEach(async () => {
      await repository.delete(category.category_id);
    });

    it.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          category.category_id.id,
          send_data as any
        )
        const entity = await repository.findById(new Uuid(presenter.id));
        const { id, created_at, ...otherProps } = presenter;
        expect(entity.toJson()).toStrictEqual({
          category_id: id,
          created_at: created_at,
          name: expected.name ?? category.name,
          description:
            'description' in expected ? expected.description : category.description,
          is_active:
            expected.is_active === true || expected.is_active === false
              ? expected.is_active
              : category.is_active,
        });
        const output = CategoryOutputMapper.toOutput(entity);
        expect(presenter).toEqual(new CategoryPresenter(output));
        expect(presenter).toBeInstanceOf(CategoryPresenter);


      }
    );
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const response = await controller.remove(category.category_id.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.category_id.id);

    expect(presenter.id).toBe(category.category_id.id);
    expect(presenter.name).toBe(category.name);
    expect(presenter.description).toBe(category.description);
    expect(presenter.is_active).toBe(category.is_active);
    expect(presenter.created_at).toStrictEqual(category.created_at);
  });

  //PArou na aula em -07:04 -> faltando o metodo de busca 





});
