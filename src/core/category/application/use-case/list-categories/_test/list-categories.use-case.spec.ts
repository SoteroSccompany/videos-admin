


//Tem que testar o toOutpput 
//Tem que testar o execute
//Teste por nome, teste por data

import { Category } from "../../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CategoryOutputMapper } from "../../common/category-output";
import { ListCategoriesUseCase } from "../list-categories.use-case";

//Teste sem parametro 
describe('ListCategoriesUseCase Unit Tests', () => {

    let useCase: ListCategoriesUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new ListCategoriesUseCase(repository);
    });

    it("Should test output method", async () => {

        let result = new CategorySearchResult({
            items: [],
            current_page: 0,
            total: 0,
            per_page: 1,
        });

        const output = useCase["toOutput"](result);

        expect(output).toStrictEqual({
            items: [],
            current_page: 0,
            per_page: 1, //E 1 pq o Match.ceil ele arredonda pra cima
            total: 0,
            last_page: 0
        })

        const entity = Category.fake().aCategory().withName("Movie").build();
        const entity2 = Category.fake().aCategory().withName("Movie2").build();
        const entity3 = Category.fake().aCategory().withName("Movie3").build();

        result = new CategorySearchResult({
            items: [entity],
            current_page: 1,
            total: 1,
            per_page: 1,
        });

        const output2 = useCase["toOutput"](result);


        expect(output2).toStrictEqual({
            items: [entity].map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 1,
            total: 1,
            last_page: 1
        });

        result = new CategorySearchResult({
            items: [entity, entity2, entity3],
            current_page: 1,
            total: 1,
            per_page: 1,
        });

        const output3 = useCase["toOutput"](result);

        expect(output3).toStrictEqual({
            items: [entity, entity2, entity3].map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 1,
            total: 1,
            last_page: 1
        });




    });

    //Desc sera sempre do menor para o maior
    let entity1 = Category.fake().aCategory().withName('test 1').withDescription("").build();
    let entity2 = Category.fake().aCategory().withName('test 2').withDescription("").withCreatedAt(new Date(new Date().getTime() + 100)).build();
    let entity3 = Category.fake().aCategory().withName('aa').withDescription("").withCreatedAt(new Date(new Date().getTime() + 200)).build();
    let entity4 = Category.fake().aCategory().withName('AAA').withDescription("").withCreatedAt(new Date(new Date().getTime() + 300)).build();
    let entity5 = Category.fake().aCategory().withName('AaA').withDescription("").withCreatedAt(new Date(new Date().getTime() + 400)).build();
    const items = [entity1, entity2, entity3, entity4, entity5];

    it("Should return output sorted by created_at when input param is empty", async () => {
        repository.items = items;
        let outPut = await useCase.execute({})
        expect(outPut).toStrictEqual({
            items: [...repository.items].reverse().map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return outPut sorted creted_at asc, when params is not by created_at asc", async () => {
        repository.items = items;
        let input = new CategorySearchParams({
            sort: "created_at",
            sort_dir: "asc"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...repository.items].map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 5,
            last_page: 1
        });
    });

    it("should return outPut filter by name and created_at by desc", async () => {
        repository.items = items;
        let input = new CategorySearchParams({
            // sort: "created_at",
            // sort_dir: "asc",
            filter: "aa"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...repository.items].slice(2, 5).reverse().map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 3,
            last_page: 1
        });
    });

    it("should return outPut filter by name and created_at by asc", async () => {
        repository.items = items;
        let input = new CategorySearchParams({
            sort: "created_at",
            sort_dir: "asc",
            filter: "aa"
        });
        const outPut = await useCase.execute(input);
        expect(outPut).toStrictEqual({
            items: [...repository.items].slice(2, 5).map(CategoryOutputMapper.toOutput),
            current_page: 1,
            per_page: 15,
            total: 3,
            last_page: 1
        });
    });





});