import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryInput } from "../update-category-input";
import { UpdateCategoryUseCase } from "../update-category.use-case";




describe("UpdateCategoryUseCase Unit Tests", () => {
    let useCase: UpdateCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new UpdateCategoryUseCase(repository);
    });


    it("shold throw error when entity not found", async () => {
        let input = new UpdateCategoryInput({ id: "fake uuid" })
        await expect(() =>
            useCase.execute(input)
        ).rejects.toThrow("Invalid UUID: fake uuid");

        const uuid = new Uuid();

        input = new UpdateCategoryInput({ id: uuid.id, name: "test" })

        await expect(() =>
            useCase.execute(input)
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));

    });

    it("shold throw error when entity not valid", async () => {
        const aggregate = new Category({ name: "Movie" })
        repository.items = [aggregate];

        let input = new UpdateCategoryInput({ id: aggregate.category_id.id, name: "test".repeat(256) })

        await expect(() =>
            useCase.execute(input)
        ).rejects.toThrow('Entity Validation Error');

    });

    it("should update a category", async () => {
        const spyUpdate = jest.spyOn(repository, "update");
        const entity = Category.fake().aCategory().withName("test").build();
        repository.items = [entity];
        let input = new UpdateCategoryInput({ id: entity.category_id.id, name: "testUpdate" })
        let output = await useCase.execute(input);
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: repository.items[0].category_id.id,
            name: repository.items[0].name,
            description: repository.items[0].description,
            is_active: repository.items[0].is_active,
            created_at: repository.items[0].created_at,
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