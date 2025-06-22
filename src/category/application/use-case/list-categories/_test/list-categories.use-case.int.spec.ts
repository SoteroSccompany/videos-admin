

import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySearchParams } from "../../../../domain/category.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.sequelize.repository";
import { CategoryOutputMapper } from "../../common/category-output";
import { ListCategoriesUseCase } from "../list-categories.use-case";

//Teste sem parametro 
describe('ListCategoriesUseCase Integration Tests', () => {

    setupSequelize({ models: [CategoryModel] })

    let useCase: ListCategoriesUseCase;
    let repository: CategorySequelizeRepository;

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new ListCategoriesUseCase(repository);
    });


    //Desc sera sempre do menor para o maior
    let entity1 = Category.fake().aCategory().withName('test 1').withDescription("").build();
    let entity2 = Category.fake().aCategory().withName('test 2').withDescription("").withCreatedAt(new Date(new Date().getTime() + 100)).build();
    let entity3 = Category.fake().aCategory().withName('aa').withDescription("").withCreatedAt(new Date(new Date().getTime() + 200)).build();
    let entity4 = Category.fake().aCategory().withName('AAA').withDescription("").withCreatedAt(new Date(new Date().getTime() + 300)).build();
    let entity5 = Category.fake().aCategory().withName('AaA').withDescription("").withCreatedAt(new Date(new Date().getTime() + 400)).build();
    const items = [entity1, entity2, entity3, entity4, entity5];

    it("Should return output sorted by created_at when input param is empty", async () => {
        await repository.bulkInsert(items);

        let outPut = await useCase.execute({})
        expect(outPut).toStrictEqual({
            items: [...items].reverse().map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return outPut sorted creted_at asc, when params is not by created_at asc", async () => {
        await repository.bulkInsert(items);

        let input = new CategorySearchParams({
            sort: "created_at",
            sort_dir: "asc"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...items].map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return outPut filter by name and created_at by desc", async () => {
        await repository.bulkInsert(items);

        let input = new CategorySearchParams({
            // sort: "created_at",
            // sort_dir: "asc",
            filter: "aa"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...items].slice(2, 5).reverse().map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 3,
            last_page: 1
        });
    });

    it("should return outPut filter by name and created_at by asc", async () => {
        await repository.bulkInsert(items);

        let input = new CategorySearchParams({
            sort: "created_at",
            sort_dir: "asc",
            filter: "aa"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...items].slice(2, 5).map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 3,
            last_page: 1
        });
    });





});