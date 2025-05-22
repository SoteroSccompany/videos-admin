import { iteratee } from "lodash";
import { Entity } from "../../../domain/entity";
import { ValueObject } from "../../../domain/value-object";
import { Uuid } from "../../../domain/value-objects/uui.vo";
import { InMemoryRepository } from "./in-memory.repository";


type StubEntityProps = {
    entity_id?: Uuid;
    name: string;
    price: number;
}

class StubEntity extends Entity {

    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: StubEntityProps) {
        super();
        this.entity_id = props.entity_id || new Uuid();
        this.name = props.name;
        this.price = props.price;
    }



    toJson() {
        return {
            entity_id: this.entity_id.id,
            name: this.name,
            price: this.price
        }
    }

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
    getEntity(): new (...args: any[]) => StubEntity {
        return StubEntity;
    }

}

describe("InMemoryrepository Unit tests", () => {
    let repo: StubInMemoryRepository;

    beforeEach(() => {
        repo = new StubInMemoryRepository();
    });

    it("should insert a new entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await repo.insert(entity);

        expect(repo.items).toHaveLength(1);
        expect(repo.items[0]).toEqual(entity);
    });

    it("should bulk insert entities", async () => {
        const entities = [
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test Entity 1",
                price: 100
            }),
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test Entity 2",
                price: 200
            })
        ];

        await repo.bulkInsert(entities);

        expect(repo.items).toHaveLength(2);
        expect(repo.items).toEqual(entities);

    });

    it("should update an existing entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await repo.insert(entity);

        const updatedEntity = new StubEntity({
            entity_id: entity.entity_id,
            name: "Updated Entity",
            price: 150
        });

        await repo.update(updatedEntity);

        expect(repo.items[0]).toEqual(updatedEntity);
    });

    it("should throw NotFoundError when updating a non-existing entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await expect(repo.update(entity)).rejects.toThrowError(new Error(`StubEntity. Not found using ID(s): ${entity.entity_id}`));
    });

    it("should delete an existing entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await repo.insert(entity);
        expect(repo.items).toHaveLength(1);

        await repo.delete(entity.entity_id);

        expect(repo.items).toHaveLength(0);
    });

    it("should throw NotFoundError when deleting a non-existing entity", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await expect(repo.delete(entity.entity_id)).rejects.toThrowError(new Error(`Entity with id ${entity.entity_id} not found`));
    });

    it("should find an entity by ID", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        await repo.insert(entity);

        const foundEntity = await repo.findById(entity.entity_id);
        expect(foundEntity).toEqual(entity);
    }
    );

    it("should find all entities", async () => {
        const entities = [
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test Entity 1",
                price: 100
            }),
            new StubEntity({
                entity_id: new Uuid(),
                name: "Test Entity 2",
                price: 200
            })
        ];

        await repo.bulkInsert(entities);

        const foundEntities = await repo.findAll();
        expect(foundEntities).toEqual(entities);
    }
    );

    it("should return null when entity not found", async () => {
        const entity = new StubEntity({
            entity_id: new Uuid(),
            name: "Test Entity",
            price: 100
        });

        //@ts-ignore
        const foundEntity = await repo._get(entity.entity_id);
        expect(foundEntity).toBeNull();
    });

});