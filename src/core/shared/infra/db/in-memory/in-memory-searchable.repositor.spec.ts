import { iteratee } from "lodash";
import { Entity } from "../../../domain/entity";
import { ValueObject } from "../../../domain/value-object";
import { Uuid } from "../../../domain/value-objects/uui.vo";
import { InMemorySearchableRepository } from "./in-memory.repository";
import { SearchParams } from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";


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
        this.entity_id = props.entity_id ?? new Uuid();
        this.name = props.name;
        this.price = props.price;
    }



    toJson(): { id: string } & StubEntityProps {
        return {
            id: this.entity_id.id,
            name: this.name,
            price: this.price
        }
    }

}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity, Uuid> {

    sortableFields: string[] = ["name"];

    getEntity(): new (...args: any[]) => StubEntity {
        return StubEntity;
    }

    protected async applyFilter(items: StubEntity[], filter: string | null): Promise<StubEntity[]> {
        if (!filter) {
            return items;
        }
        return items.filter((i) => {
            return (
                i.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
                i.price.toString() === filter
            )
        });
    }

}


describe("InMemorySearchableRepository Unit tests", () => {
    let repo: StubInMemorySearchableRepository;
    beforeEach(() => {
        repo = new StubInMemorySearchableRepository();
    });


    describe("applyFilter method", () => {


        it("should no filter items when filter page is null", async () => {
            const items = [new StubEntity({ name: "Test", price: 100 })];
            const spyFilterMethod = jest.spyOn(items, "filter" as any);
            const itemsFiltered = await repo["applyFilter"](items, null);
            expect(itemsFiltered).toStrictEqual(items);
            expect(spyFilterMethod).not.toHaveBeenCalled();
        });

        it("should filter using a filter param", async () => {
            const items = [
                new StubEntity({ name: "TEST", price: 100 }),
                new StubEntity({ name: "test", price: 200 }),
                new StubEntity({ name: "Example", price: 200 })
            ];
            const spyFilterMethod = jest.spyOn(items, "filter" as any);
            let itemsFiltered = await repo["applyFilter"](items, "TEST");
            expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
            expect(itemsFiltered[0].name).toBe("TEST");
            expect(spyFilterMethod).toHaveBeenCalledTimes(1);

            itemsFiltered = await repo["applyFilter"](items, "200");
            expect(itemsFiltered).toStrictEqual([items[1], items[2]]);
            expect(itemsFiltered[0].price).toBe(200);
            expect(spyFilterMethod).toHaveBeenCalledTimes(2);

            itemsFiltered = await repo["applyFilter"](items, "no-filter");
            expect(itemsFiltered).toHaveLength(0);
            expect(spyFilterMethod).toHaveBeenCalledTimes(3);
        })

    });

    describe("applySort method", () => {

        it("should sort items", async () => {
            const items = [
                new StubEntity({ name: "Test A", price: 100 }),
                new StubEntity({ name: "Test B", price: 200 }),
                new StubEntity({ name: "Test C", price: 300 })
            ]

            let itemsSorted = await repo["applySort"](items, null, null);
            expect(itemsSorted).toStrictEqual(items);

            itemsSorted = await repo["applySort"](items, "name", "asc");
            expect(itemsSorted).toStrictEqual([
                items[0],
                items[1],
                items[2]
            ]);
        })

        it("should no sort", async () => {
            const items = [
                new StubEntity({ name: "Test A", price: 100 }),
                new StubEntity({ name: "Test B", price: 200 }),
                new StubEntity({ name: "Test C", price: 300 })
            ]

            let itemsSorted = await repo["applySort"](items, "no-sort", "asc");
            expect(itemsSorted).toStrictEqual(items);


        });

    });

    describe("applyPaginate method", () => {

        it("should paginate items", async () => {
            const items = [
                new StubEntity({ name: "Test A", price: 100 }),
                new StubEntity({ name: "Test B", price: 200 }),
                new StubEntity({ name: "Test C", price: 300 })
            ];

            let itemsPaginated = await repo["applyPaginate"](items, 1, 2);
            expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

            itemsPaginated = await repo["applyPaginate"](items, 2, 2);
            expect(itemsPaginated).toStrictEqual([items[2]]);

            itemsPaginated = await repo["applyPaginate"](items, 3, 2);
            expect(itemsPaginated).toHaveLength(0);
        })



    });

    describe("search method", () => {

        it("should apply only paginate when other params are null", async () => {
            const entity = new StubEntity({ name: "Test A", price: 100 });
            const items = Array(16).fill(entity)
            repo.items = items;

            const result = await repo.search(new SearchParams());
            expect(result).toStrictEqual(
                new SearchResult({
                    items: Array(15).fill(entity),
                    total: 16,
                    current_page: 1,
                    per_page: 15
                })
            )


        });

        it("should apply pagination and filtered", async () => {
            const items = [
                new StubEntity({ name: "Test A", price: 100 }),
                new StubEntity({ name: "Test B", price: 200 }),
                new StubEntity({ name: "Test C", price: 300 }),
                new StubEntity({ name: "Test D", price: 400 }),
                new StubEntity({ name: "Test E", price: 500 }),
            ]

            repo.items = items;

            let result = await repo.search(new SearchParams({
                filter: "Test",
                page: 1,
                per_page: 2
            }));
            expect(result).toStrictEqual(
                new SearchResult({
                    items: [items[0], items[1]],
                    total: 5,
                    current_page: 1,
                    per_page: 2
                })
            );
            result = await repo.search(new SearchParams({
                filter: "Test",
                page: 2,
                per_page: 2
            }));
            expect(result).toStrictEqual(
                new SearchResult({
                    items: [items[2], items[3]],
                    total: 5,
                    current_page: 2,
                    per_page: 2
                })
            );

        });



    });


});