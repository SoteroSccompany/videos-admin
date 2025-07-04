import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import * as CategoryProviders from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from '../../src/nest-modules/shared-module/testing/helpers';
import { CategoriesController } from '../../src/nest-modules/categories-module/categories.controller';
import { Category } from '@core/category/domain/category.entity';
import { GetCategoryFixture } from 'src/nest-modules/categories-module/testing/category.fixture';
import { CategoryOutputMapper } from '@core/category/application/use-case/common/category-output';

describe('CategoriesController (e2e)', () => {
    const nestApp = startApp();
    describe('/categories/:id (GET)', () => {
        describe('should a response error when id is invalid or not found', () => {
            const arrange = [
                {
                    id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                    expected: {
                        message:
                            'Category. Not found using ID(s): 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
                        statusCode: 404,
                        error: 'Not Found',
                    },
                },
                {
                    id: 'fake id',
                    expected: {
                        statusCode: 422,
                        message: 'Validation failed (uuid is expected)',
                        error: 'Unprocessable Entity',
                    },
                },
            ];

            test.each(arrange)('when id is $id', async ({ id, expected }) => {
                return request(nestApp.app.getHttpServer())
                    .get(`/categories/${id}`)
                    .expect(expected.statusCode)
                    .expect(expected);
            });
        });

        it('should return a category ', async () => {
            const categoryRepo = nestApp.app.get<ICategoryRepository>(
                CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
            );
            const category = Category.fake().aCategory().build();
            await categoryRepo.insert(category);

            const res = await request(nestApp.app.getHttpServer())
                .get(`/categories/${category.category_id.id}`)
                .expect(200);
            const keyInResponse = GetCategoryFixture.keysInResponse;
            expect(Object.keys(res.body)).toStrictEqual(['data']);
            expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

            const presenter = CategoriesController.serialize( //E coloca assim por ser como o controller ira retornar. 
                CategoryOutputMapper.toOutput(category), //Faz assim por ser a forma como o useCase ira retornar 
            );
            const serialized = instanceToPlain(presenter); //Coloca o instanceToPlain para remover os metadados do class-transformer e para transformar a classe em objeto simples
            expect(res.body.data).toStrictEqual(serialized);
        });
    });
});