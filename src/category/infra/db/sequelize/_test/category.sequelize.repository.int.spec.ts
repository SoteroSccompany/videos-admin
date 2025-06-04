import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category.sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uui.vo";
import { NotFoundError } from "../../../../../shared/domain/error/not-found.error";




describe("CategorySequelizeRepository Integration Tests", () => {


    let sequelize: Sequelize;
    let repository: CategorySequelizeRepository;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            models: [CategoryModel],
            logging: false,
        })
        await sequelize.sync({ force: true });
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


});