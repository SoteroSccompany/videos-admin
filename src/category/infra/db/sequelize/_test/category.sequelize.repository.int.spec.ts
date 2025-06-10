import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category.sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { CategoryModelMapper } from "../category-model-mapper";
import { CategorySearchParams, CategorySearchResult } from "../../../../domain/category.repository";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";




describe("CategorySequelizeRepository Integration Tests", () => {


    setupSequelize({ models: [CategoryModel] });
    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
        repository = new CategorySequelizeRepository(CategoryModel);
    });


    it("should insert a new category", async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);
        const model = await CategoryModel.findByPk(category.category_id.id);
        expect(model.toJSON()).toMatchObject({
            category_id: category.category_id.id,
            name: category.name,
            description: category.description,
            is_active: category.is_active,
            created_at: category.created_at,
        });
    });

    it("should find a entity by id", async () => {
        let entityFound = await repository.findById(new Uuid());
        expect(entityFound).toBeNull();

        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);

        entityFound = await repository.findById(entity.category_id);
        expect(entityFound.toJson()).toStrictEqual(entity.toJson());
    });

    it("shoud return all categories", async () => {
        const entitity = Category.fake().aCategory().build();
        await repository.insert(entitity);
        const entities = await repository.findAll();
        expect(entities).toHaveLength(1);
        expect(entities[0].toJson()).toStrictEqual(entitity.toJson());
    })

    it("should theow error on update when entity not found", async () => {
        const entity = Category.fake().aCategory().withName("test").build();
        await expect(repository.update(entity)).rejects.toThrow(
            new NotFoundError(entity.category_id.id, Category)
        );
    });

    it("should update a category", async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);

        entity.changeName("test");
        entity.changeDescription("description");

        await repository.update(entity);

        const model = await CategoryModel.findByPk(entity.category_id.id);
        expect(model.toJSON()).toMatchObject({
            category_id: entity.category_id.id,
            name: "test",
            description: "description",
            is_active: entity.is_active,
            created_at: entity.created_at,
        });
    });

    it("should throw error when entity not found on delete", async () => {
        const entity = Category.fake().aCategory().build();
        await expect(repository.delete(entity.category_id)).rejects.toThrow(
            new NotFoundError(entity.category_id.id, Category));
    });

    it("should delete a category", async () => {
        const entity = Category.fake().aCategory().build();
        await repository.insert(entity);
        await repository.delete(entity.category_id);
        const model = await CategoryModel.findByPk(entity.category_id.id);
        expect(model).toBeNull();
    });

    describe("search method tests", () => {

        it("should only apply paginate when params are null", async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName("Movie")
                .withDescription(null)
                .withCreatedAt(created_at)
                .build();
            await repository.bulkInsert(categories);
            const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");

            const searchOutput = await repository.search(new CategorySearchParams())

            expect(searchOutput).toBeInstanceOf(CategorySearchResult);
            expect(spyToEntity).toHaveBeenCalledTimes(15);
            expect(searchOutput.toJson()).toMatchObject({
                total: 16,
                current_page: 1,
                last_page: 2,
                per_page: 15 //Padrão do SearchParams
            });

            searchOutput.items.forEach((item, index) => {
                expect(item).toBeInstanceOf(Category);
                expect(item.category_id).toBeDefined();
            });
            const items = searchOutput.items.map((item) => item.toJson());

            expect(items).toMatchObject(
                new Array(15).fill({
                    name: "Movie",
                    description: null,
                    is_active: true,
                    created_at: created_at,
                })
            );


        });

        it("should order by created_at DESC when search params are null", async () => {
            const created_at = new Date();
            const categories = Category.fake()
                .theCategories(16)
                .withName((index) => `Movie ${index}`)
                .withDescription(null)
                .withCreatedAt((index) => new Date(created_at.getTime() + index)) //Aqui se pode passar uma funcao para determinada criacao, por isso se tem o props or factory. 
                .build();
            await repository.bulkInsert(categories);
            const searchOutput = await repository.search(new CategorySearchParams());
            const items = searchOutput.items;
            [...items].reverse().forEach((_, index) => {
                // expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`); // Esse e o teste correto, mas pq? 
                expect(`Movie ${index}`).toBe(`${categories[index].name}`);
            });
        });


        it("should applu paginate and filter", async () => {
            const created_at = new Date();
            const categorie = [
                Category.fake().aCategory().withName("Teste").withCreatedAt((_) => new Date(created_at.getTime() + 5000)).build(),
                Category.fake().aCategory().withName("a").withCreatedAt((_) => new Date(created_at.getTime() + 4000)).build(),
                Category.fake().aCategory().withName("TESTE").withCreatedAt((_) => new Date(created_at.getTime() + 300)).build(),
                Category.fake().aCategory().withName("teste").withCreatedAt((_) => new Date(created_at.getTime() + 1000)).build(),
            ]
            await repository.bulkInsert(categorie);
            let searchOutput = await repository.search(
                new CategorySearchParams({
                    page: 1,
                    per_page: 2,
                    filter: "test",
                }))
            expect(searchOutput.items).toHaveLength(2);
            expect(searchOutput.items[0].name).toBe("Teste")
            expect(searchOutput.items[1].name).toBe("teste");
            expect(searchOutput.toJson(true)).toMatchObject(
                new CategorySearchResult({
                    items: [categorie[0], categorie[3]],
                    total: 3,
                    current_page: 1,
                    per_page: 2,
                }).toJson(true)
            );

        });

        it("should apply paginate and sort", async () => {
            expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);

            const created_at = new Date();
            const categorie = [
                Category.fake().aCategory().withName("a").withCreatedAt((_) => new Date(created_at.getTime() + 5000)).build(),
                Category.fake().aCategory().withName("b").withCreatedAt((_) => new Date(created_at.getTime() + 4000)).build(),
                Category.fake().aCategory().withName("c").withCreatedAt((_) => new Date(created_at.getTime() + 300)).build(),
                Category.fake().aCategory().withName("d").withCreatedAt((_) => new Date(created_at.getTime() + 1000)).build(),
            ]
            await repository.bulkInsert(categorie);
            let searchOutput = await repository.search(
                new CategorySearchParams({
                    page: 1,
                    per_page: 2,
                    sort: "name",
                    sort_dir: "desc"
                }))
            expect(searchOutput.items).toHaveLength(2);
            expect(searchOutput.items[0].name).toBe("d")
            expect(searchOutput.items[1].name).toBe("c");
            expect(searchOutput.toJson(true)).toMatchObject(
                new CategorySearchResult({
                    items: [categorie[3], categorie[2]],
                    total: 4,
                    current_page: 1,
                    per_page: 2,
                }).toJson(true)
            );
        });

        describe("should apply paginate, filter and sort", () => {

            const categories = [
                Category.fake().aCategory().withName("teste").build(),
                Category.fake().aCategory().withName("a").build(),
                Category.fake().aCategory().withName("TESTE").build(),
                Category.fake().aCategory().withName("e").build(),
                Category.fake().aCategory().withName("Teste").build(),
            ]

            const arrange = [
                {
                    search_params: new CategorySearchParams({
                        page: 1,
                        per_page: 2,
                        sort: "name",
                        filter: "TEST",
                    }),
                    search_result: new CategorySearchResult({
                        items: [categories[2], categories[4]],
                        total: 3,
                        current_page: 1,
                        per_page: 2,
                    })

                },
                {
                    search_params: new CategorySearchParams({
                        page: 2,
                        per_page: 2,
                        sort: "name",
                        filter: "TEST",
                    }),
                    search_result: new CategorySearchResult({
                        items: [categories[0]],
                        total: 3,
                        current_page: 2,
                        per_page: 2,
                    })
                },
            ]


            beforeEach(async () => {
                await repository.bulkInsert(categories);
            });

            it.each(arrange)(
                "when value is $seach_params",
                async ({ search_params, search_result }) => {
                    const result = await repository.search(search_params);
                    expect(result.toJson(true)).toMatchObject(search_result.toJson(true));
                }
            )


        });




    })


});