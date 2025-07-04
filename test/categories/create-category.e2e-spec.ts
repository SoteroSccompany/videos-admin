import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { CreateCategoryFixture } from 'src/nest-modules/categories-module/testing/category.fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { applyGlobalConfig } from 'src/nest-modules/global.config';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uui.vo';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { CategoryOutputMapper } from '@core/category/application/use-case/common/category-output';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesController (e2e)', () => {
    const appHelper = startApp();
    let categoryRepo: ICategoryRepository;

    beforeEach(async () => {
        // const moduleFixture: TestingModule = await Test.createTestingModule({
        //     imports: [AppModule], //Se coloca aqui a aplicacao inteira, entao aqui se tem tudo que se precisa para testar a aplicacao. 
        //     //O teste e mais custoso, por isso esta no topo da pirande e por isso e mais lento e mais caro
        // }).compile();

        // app = moduleFixture.createNestApplication(); //Gera a aplicacao nest e ele controla com base.
        // applyGlobalConfig(app); //Aplica as configuracoes globais, como pipes, interceptors e filters
        // await app.init(); //Aqui inicia a implementacao. 
        categoryRepo = appHelper.app.get<ICategoryRepository>(
            CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
        );
    });

    describe('/categories (POST)', () => {

        describe('Should return error with 422 status code when throw EntityValidationError', () => {
            const invalidRequest = CreateCategoryFixture.arrangeForEntityValidationError();
            const arrange = Object.keys(invalidRequest).map((key) => {
                return {
                    label: key,
                    value: invalidRequest[key],
                }
            });
            it.each(arrange)(
                'when body is $label',
                ({ value }) => {
                    return request(appHelper.app.getHttpServer())
                        .post('/categories')
                        .send(value.send_data)
                        // .expect((res) => {
                        //     console.log(res.body)
                        // }) //Forma para ser mais produtivo em relacao ao debug de erros que podem vir.
                        .expect(422)
                        .expect(value.expected)
                }
            );
        });

        describe('Should return error with 422 status code when request body is invalid', () => {
            const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();
            const arrange = Object.keys(invalidRequest).map((key) => {
                return {
                    label: key,
                    value: invalidRequest[key],
                }
            });
            it.each(arrange)(
                'when body is $label',
                async ({ value }) => {
                    return request(appHelper.app.getHttpServer())
                        .post('/categories')
                        .send(value.send_data)
                        .expect(422)
                        .expect(value.expected)
                }
            );
        });

        describe('Should create a category', () => {

            const arrange = CreateCategoryFixture.arrangeForCreate();
            it.each(arrange)(
                'when body is $send_data',
                async ({ send_data, expected }) => {
                    const res = await request(appHelper.app.getHttpServer())
                        .post('/categories')
                        .send(send_data)
                        .expect(201)

                    const keysInResponse = CreateCategoryFixture.keysInResponse;
                    expect(Object.keys(res.body)).toStrictEqual(['data'])
                    const id = res.body.data.id;
                    const categoryCreated = await categoryRepo.findById(new Uuid(id))

                    const presenter = CategoriesController.serialize(CategoryOutputMapper.toOutput(categoryCreated));
                    const serialized = instanceToPlain(presenter);
                    expect(res.body.data).toStrictEqual({
                        id: serialized.id,
                        created_at: serialized.created_at,
                        ...expected
                    });

                    // const presenter = await controller.create(send_data as any);
                    // const entity = await repository.findById(new Uuid(presenter.id))
                    // const { id, created_at, ...otherProps } = presenter;
                    // expect(entity.toJson()).toStrictEqual({
                    //     category_id: id,
                    //     created_at: created_at,
                    //     ...otherProps
                    // });
                    // const output = CategoryOutputMapper.toOutput(entity);
                    // expect(presenter).toEqual(new CategoryPresenter(output));
                    // await repository.delete(entity.category_id);
                }
            );

        });

    });


    // it('/ (GET)', () => {
    //     return request(app.getHttpServer())
    //         .get('/')
    //         .expect(404);
    // });
});
