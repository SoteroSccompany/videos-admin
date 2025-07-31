import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category.sequelize.repository";
import { UpdateCategoryInput } from "../update-category-input";
import { UpdateCategoryUseCase } from "../update-category.use-case";




describe("UpdateCategoryUseCase Integration Tests", () => {
    setupSequelize({ models: [CategoryModel] });
    let useCase: UpdateCategoryUseCase;
    let repository: CategorySequelizeRepository;

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new UpdateCategoryUseCase(repository);
    });


    it("shold throw error when entity not found", async () => {

        const uuid = new Uuid();
        let input = new UpdateCategoryInput({ id: uuid.id, name: "test" })

        await expect(() =>
            useCase.execute(input)
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));

    });

    it("should update a category", async () => {
        const spyUpdate = jest.spyOn(repository, "update");
        const entity = Category.fake().aCategory().withName("test").build();

        await repository.insert(entity);
        let input = new UpdateCategoryInput({ id: entity.category_id.id, name: "testUpdate" })


        let output = await useCase.execute(input);
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        const expectedFind = await repository.findById(entity.category_id);
        expect(expectedFind).toBeDefined();
        expect(output).toStrictEqual({
            id: expectedFind.category_id.id,
            name: expectedFind.name,
            description: expectedFind.description,
            is_active: expectedFind.is_active,
            created_at: expectedFind.created_at,
        });



        type Arrange = {
            input: {
                id: string;
                name: string;
                description?: null | string;
                is_active?: boolean;
            };
            expected: {
                id: string;
                name: string;
                description: null | string;
                is_active: boolean;
                created_at: Date;
            };
        };
        const arrange: Arrange[] = [
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                    is_active: false,
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                    is_active: true,
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: true,
                    created_at: entity.created_at,
                },
            },
            {
                input: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                },
                expected: {
                    id: entity.category_id.id,
                    name: 'test',
                    description: 'some description',
                    is_active: false,
                    created_at: entity.created_at,
                },
            },
        ];

        for (const i of arrange) {
            output = await useCase.execute({
                id: i.input.id,
                ...('name' in i.input && { name: i.input.name }),
                ...('description' in i.input && { description: i.input.description }),
                ...('is_active' in i.input && { is_active: i.input.is_active }),
            });
            expect(output).toStrictEqual({
                id: entity.category_id.id,
                name: i.expected.name,
                description: i.expected.description,
                is_active: i.expected.is_active,
                created_at: i.expected.created_at,
            });
        }

    });



});