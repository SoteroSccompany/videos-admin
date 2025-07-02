
import { CategoriesController } from '../categories.controller';
import { CreateCategoryUseCaseOutput } from '@core/category/application/use-case/create-category/create-category.use-case';
import { CategoryCollectionPresenter, CategoryPresenter } from '../category-presenter';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { SearchCategoriesDto } from '../dto/search-categories.dto';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../shared-module/pagination.presenter';

// beforeEach(async () => {
//   const module: TestingModule = await Test.createTestingModule({
//     imports: [
//       ConfigModule.forRoot({}),
//       // DatabaseModule,
//       CategoriesModule, //Registra o model no sequelize
//     ], //Pode ser passado dessa forma
//   })
//     .overrideProvider(getModelToken(CategoryModel))//Para sobrescrever algum provider, se necessário
//     .useValue({})
//     .overrideProvider('CategoryRepository')
//     .useValue(CategoryInMemoryRepository) //Aqui garante que sera utilizado o outro repositorio
//     .compile();

//   controller = module.get<CategoriesController>(CategoriesController);
//   // console.log(module.get(ConfigService).get("DB_HOST"));
// });

describe('CategoriesController', () => { //Deveria ter mais testes para que se tenha exatamente o comportamento que se espera do controller, como por exemplo para lidar com erros -> Ou isso fica sendo uma responsbilidade 
  //De uma parte do nest para lidar com os erros espostos pelo core para entao saber o que retornar.
  let controller: CategoriesController;


  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it("should be create a category", async () => {
    const output: CreateCategoryUseCaseOutput = { //Se coloca essa tipagem para garantir que o retorno seja igual ao do useCase.
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1",
      description: "Description of Category 1",
      is_active: true,
      created_at: new Date(),
    }
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    //@ts-expect-error defined part of methdos
    controller['createUseCase'] = mockCreateUseCase;

    const createCategoryDto: CreateCategoryDto = {
      name: "Category 1",
      description: "Description of Category 1",
      is_active: true,
    };
    const presenter = await controller.create(createCategoryDto);
    expect(presenter).toEqual({
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1",
      description: "Description of Category 1",
      is_active: true,
      created_at: expect.any(Date),
    });
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(createCategoryDto);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });


  it("should be updates a category", async () => {
    const id = "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b";
    const output: CreateCategoryUseCaseOutput = {
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1 Updated",
      description: "Description of Category 1 Updated",
      is_active: true,
      created_at: new Date(),
    }

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    //@ts-expect-error defined part of methdos
    controller['updateUseCase'] = mockUpdateUseCase;

    const input: Omit<UpdateCategoryDto, 'id'> = {
      name: "Category 1 Updated",
      description: "Description of Category 1 Updated",
      is_active: true,
    }
    const presenter = await controller.update(id, input);
    expect(presenter).toEqual({
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1 Updated",
      description: "Description of Category 1 Updated",
      is_active: true,
      created_at: expect.any(Date),
    });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      ...input,
      id
    });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));


  });

  it("should be get a category", async () => {
    const id = "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b";
    const output: CreateCategoryUseCaseOutput = {
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1",
      description: "Description of Category 1",
      is_active: true,
      created_at: new Date(),
    }

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    //@ts-expect-error defined part of methdos
    controller['getUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);
    expect(presenter).toEqual({
      id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
      name: "Category 1",
      description: "Description of Category 1",
      is_active: true,
      created_at: expect.any(Date),
    });
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it("should be delete a category", async () => {
    const id = "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b";

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve()),
    }

    //@ts-expect-error defined part of methdos
    controller['deleteUseCase'] = mockDeleteUseCase;

    await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it("should be search categories", async () => {
    const created_at = new Date();
    const output = {
      items: [
        {
          id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
          name: "Category 1",
          description: "Description of Category 1",
          is_active: true,
          created_at,
        }
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    //@ts-expect-error defined part of methdos
    controller['listUseCase'] = mockListUseCase;

    const searchParamsDto: SearchCategoriesDto = {};
    const presenter = await controller.search(searchParamsDto);
    expect(instanceToPlain(presenter)).toEqual({
      data: [
        {
          id: "96c4b0f-8d2e-4b1a-9c3f-5c6d7e8f9a0b",
          name: "Category 1",
          description: "Description of Category 1",
          is_active: true,
          created_at: created_at.toISOString(), //Converte a data para o formato ISO
        }
      ],
      meta: {
        total: 1,
        current_page: 1,
        last_page: 1,
        per_page: 15,
      }
    });
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParamsDto);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(presenter).toStrictEqual(new CategoryCollectionPresenter(output));
    expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
    expect(presenter.data[0]).toBeInstanceOf(CategoryPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParamsDto);
  });


});
