import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberInMemoryRepository } from "./cast-member-in-memory.repository";


describe("CastMemberInMemoryRepository", () => {

    let repository: CastMemberInMemoryRepository;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
    });

    it("should no filter items when filter object is null", async () => {
        const items = [CastMember.fake().aCastMember().build()];
        const filterSpy = jest.spyOn(items, "filter" as any);
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applyFilter"](items, null);
        expect(itemsFiltered).toStrictEqual(items);
        expect(filterSpy).not.toHaveBeenCalled();
    });

    it("should no filter items when using filter", async () => {
        const items = [
            CastMember.fake().aCastMember().withName("CastMember 1").build(),
            CastMember.fake().aCastMember().withName("CastMember 2").build(),
            CastMember.fake().aCastMember().withName("CastMember 3").build(),
        ];
        const filterSpy = jest.spyOn(items, "filter" as any);
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applyFilter"](items, "CastMember 1");
        expect(filterSpy).toHaveBeenCalledTimes(1);
        expect(itemsFiltered[0]).toStrictEqual(items[0]);
    });

    it("should sort by created_at when sort is null", async () => {
        const created_at = new Date();

        const items = [
            CastMember.fake().aCastMember().withName("CastMember 1").withCreatedAt(created_at).build(),
            CastMember.fake().aCastMember().withName("CastMember 2").withCreatedAt(new Date(created_at.getTime() + 100)).build(),
            CastMember.fake().aCastMember().withName("CastMember 3").withCreatedAt(new Date(created_at.getTime() + 200)).build(),
        ];
        await repository.bulkInsert(items);


        const itemsFiltered = await repository["applySort"](items, null, null);
        expect(itemsFiltered).toStrictEqual([
            items[2],
            items[1],
            items[0]
        ]);
    });

    it("should sort by name when sort is name", async () => {
        const items = [
            CastMember.fake().aCastMember().withName("A").build(),
            CastMember.fake().aCastMember().withName("B").build(),
            CastMember.fake().aCastMember().withName("C").build(),
        ];
        await repository.bulkInsert(items);
        let itemsFiltered = await repository["applySort"](items, "name", "asc");
        expect(itemsFiltered).toStrictEqual([
            items[0],
            items[1],
            items[2]
        ]);
        itemsFiltered = await repository["applySort"](items, "name", "desc");
        expect(itemsFiltered).toStrictEqual([
            items[2],
            items[1],
            items[0]
        ]);

    });

    it("should create category by getEntity", () => {
        const spyGetEntity = jest.spyOn(repository, 'getEntity');
        const CastMemberEntity = repository.getEntity();
        const category = new CastMemberEntity({ name: "teste" });
        expect(category).toBeInstanceOf(CastMemberEntity);
        expect(spyGetEntity).toHaveBeenCalled();

    });




});