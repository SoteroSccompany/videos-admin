import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberSequelizeRepository } from "../cast-member.repository";
import { CastMemberModel } from "../cast-member.model";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo";
import { CastMemberSearchParams, CastMemberSearchResult } from "@core/cast-member/domain/cast-member.repository";
import omit from "lodash/omit";



describe('CastMemberRepository Integration Tests', () => {

    setupSequelize({ models: [CastMemberModel] })
    let repository: CastMemberSequelizeRepository;

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
    });


    describe("normal methods", () => {

        it("should insert a new cast member", async () => {
            const entity = CastMember.fake().aCastMember().build();
            await repository.insert(entity);
            const model = await CastMemberModel.findByPk(entity.cast_member_id.id);
            expect(model.toJSON()).toStrictEqual({
                cast_member_id: entity.cast_member_id.id,
                name: entity.name,
                cast_member_type: entity.cast_member_type.cast_member_type,
                created_at: entity.created_at,
            });
        })

        it("should insert multiple cast members", async () => {
            const entities = CastMember.fake().theCastMembers(3).build();
            await repository.bulkInsert(entities);
            const models = await CastMemberModel.findAll();
            expect(models.length).toBe(3);
            expect(models.map(m => m.toJSON())).toEqual(
                entities.map(e => ({
                    cast_member_id: e.cast_member_id.id,
                    name: e.name,
                    cast_member_type: e.cast_member_type.cast_member_type,
                    created_at: e.created_at,
                }))
            );
        });

        describe("update", () => {

            it("should throw an error when trying to update a non-existing cast member", async () => {
                const entity = CastMember.fake().aCastMember().build();
                await expect(repository.update(entity)).rejects.toThrow(
                    new NotFoundError(entity.cast_member_id.id, repository.getEntity())
                );
            });

            it("should update an existing cast member", async () => {
                const entity = CastMember.fake().aCastMember().build();
                await repository.insert(entity);
                const updatedEntity = CastMember.fake().aCastMember().withUuid(entity.cast_member_id).build();
                await repository.update(updatedEntity);
                const model = await CastMemberModel.findByPk(entity.cast_member_id.id);
                expect(model.toJSON()).toStrictEqual({
                    cast_member_id: updatedEntity.cast_member_id.id,
                    name: updatedEntity.name,
                    cast_member_type: updatedEntity.cast_member_type.cast_member_type,
                    created_at: updatedEntity.created_at,
                });
            });

        });

        describe("delete", () => {
            it("should delete a cast member", async () => {
                const entity = CastMember.fake().aCastMember().build();
                await repository.insert(entity);
                await repository.delete(entity.cast_member_id);
                const model = await CastMemberModel.findByPk(entity.cast_member_id.id);
                expect(model).toBeNull();
            });

            it("should throw an error when trying to delete a non-existing cast member", async () => {
                const entity = CastMember.fake().aCastMember().build();
                await expect(repository.delete(entity.cast_member_id)).rejects.toThrow(
                    new NotFoundError(entity.cast_member_id.id, repository.getEntity())
                );
            });

        });

        it("should find a cast member by id", async () => {
            const entity = CastMember.fake().aCastMember().build();
            await repository.insert(entity);
            const foundEntity = await repository.findById(entity.cast_member_id);
            expect(foundEntity).toEqual(entity);
            expect(foundEntity).toBeInstanceOf(CastMember);
        });

        it("should return all cast members", async () => {
            const entities = CastMember.fake().theCastMembers(3).build();
            await repository.bulkInsert(entities);
            const foundEntities = await repository.findAll();
            expect(foundEntities.length).toBe(3);
            expect(foundEntities).toEqual(expect.arrayContaining(entities));
            expect(foundEntities.every(e => e instanceof CastMember)).toBeTruthy();
        });


    });


    describe("search method", () => {

        it("should only apply pagination when no filters are provided", async () => {
            const created_at = new Date();
            const name = "Cast Member";
            const cast_member_type = new CastMemberType(2);
            const entities = CastMember.fake()
                .theCastMembers(3)
                .withName(name)
                .withCastMemberType(cast_member_type)
                .withCreatedAt(created_at)
                .build();

            await repository.bulkInsert(entities);
            const searchParams = new CastMemberSearchParams();
            const result = await repository.search(searchParams);
            expect(result.items.length).toBe(3);
            expect(result).toMatchObject({
                items: entities,
                total: 3,
                current_page: 1,
                per_page: 15,
                last_page: 1,
            });

        });

        it("should order by created_at when search params are empty", async () => {
            const created_at = new Date();
            const name = "Cast Member";
            const cast_member_type = new CastMemberType(2);
            const entities = CastMember.fake()
                .theCastMembers(3)
                .withName((index) => `${name} ${index}`)
                .withCastMemberType(cast_member_type)
                .withCreatedAt((index) => new Date(created_at.getTime() + index))
                .build();
            await repository.bulkInsert(entities);
            const searchParams = new CastMemberSearchParams();
            const result = await repository.search(searchParams);
            expect(result.items.length).toBe(3);
            const items = result.items;
            [...items].reverse().forEach((item, index) => {
                expect(item.name).toBe(`${name} ${index}`);
                expect(item.created_at.getTime()).toBe(created_at.getTime() + index);
            });
            expect(result.items[0].cast_member_id.id).toBe(entities[2].cast_member_id.id);
            expect(result.items[1].cast_member_id.id).toBe(entities[1].cast_member_id.id);
            expect(result.items[2].cast_member_id.id).toBe(entities[0].cast_member_id.id);
        });

        it("should apply pagination and filter", async () => {
            const created_at = new Date();
            const cast_member_type = new CastMemberType(2);
            const entities = [
                CastMember.fake().aCastMember().withName("A").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("a").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("Aa").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("AA").withCastMemberType(cast_member_type).withCreatedAt(created_at).build()
            ]
            await repository.bulkInsert(entities);
            const searchParams = new CastMemberSearchParams({
                filter: "a"
            });
            const result = await repository.search(searchParams);
            expect(omit(result, 'items')).toEqual({
                total: 4,
                current_page: 1,
                per_page: 15,
                last_page: 1,
            });
            expect(result.items.length).toBe(4);
            expect(result.items[0].name).toBe("A");
            expect(result.items[1].name).toBe("a");
            expect(result.items[2].name).toBe("Aa");
            expect(result.items[3].name).toBe("AA");

        });

        it("should apply pagination, filter and sort", async () => {
            const created_at = new Date();
            const cast_member_type = new CastMemberType(2);
            const entities = [
                CastMember.fake().aCastMember().withName("A").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("a").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("Aa").withCastMemberType(cast_member_type).withCreatedAt(created_at).build(),
                CastMember.fake().aCastMember().withName("AA").withCastMemberType(cast_member_type).withCreatedAt(created_at).build()
            ]
            await repository.bulkInsert(entities);
            const searchParams = new CastMemberSearchParams({
                filter: "a",
                sort: "name",
                sort_dir: "desc"
            });
            const result = await repository.search(searchParams);
            expect(omit(result, 'items')).toEqual({
                total: 4,
                current_page: 1,
                per_page: 15,
                last_page: 1,
            });
            expect(result.items.length).toBe(4);
            expect(result.items[0].name).toBe("a");
            expect(result.items[1].name).toBe("Aa");
            expect(result.items[2].name).toBe("AA");
            expect(result.items[3].name).toBe("A");
        });

        describe("should apply paginate, filter and sort", () => {
            const entities = [
                CastMember.fake().aCastMember().withName("c").withCastMemberType(new CastMemberType(1)).build(),
                CastMember.fake().aCastMember().withName("a").withCastMemberType(new CastMemberType(2)).build(),
                CastMember.fake().aCastMember().withName("Teste").withCastMemberType(new CastMemberType(1)).build(),
                CastMember.fake().aCastMember().withName("b").withCastMemberType(new CastMemberType(2)).build(),
                CastMember.fake().aCastMember().withName("TESTE").withCastMemberType(new CastMemberType(1)).build()
            ];

            const arrange = [
                {
                    searchParams: new CastMemberSearchParams({
                        page: 1,
                        per_page: 2,
                        filter: "teste",
                        sort: "name",
                        sort_dir: "asc"
                    }),
                    searchResult: new CastMemberSearchResult({
                        items: entities.filter(e => e.name.toLowerCase().includes("teste")).reverse(),
                        current_page: 1,
                        per_page: 2,
                        total: 2
                    })
                },
                {
                    searchParams: new CastMemberSearchParams({
                        page: 1,
                        per_page: 2,
                        filter: "c",
                        sort: "name",
                        sort_dir: "asc"
                    }),
                    searchResult: new CastMemberSearchResult({
                        items: entities.filter(e => e.name.toLowerCase().includes("c")),
                        current_page: 1,
                        per_page: 2,
                        total: 1
                    })
                },
                {
                    searchParams: new CastMemberSearchParams({
                        page: 1,
                        per_page: 3,
                        filter: "1",
                        sort: "name",
                        sort_dir: "desc"
                    }),
                    searchResult: new CastMemberSearchResult({
                        items: [entities[0], entities[2], entities[4]],
                        current_page: 1,
                        per_page: 3,
                        total: 3
                    })
                },
                {
                    searchParams: new CastMemberSearchParams({
                        page: 1,
                        per_page: 3,
                        filter: "1",
                        sort: "name",
                        sort_dir: "asc"
                    }),
                    searchResult: new CastMemberSearchResult({
                        items: [entities[4], entities[2], entities[0]],
                        current_page: 1,
                        per_page: 3,
                        total: 3
                    })
                },
            ]

            beforeEach(async () => {
                await repository.bulkInsert(entities);
            });

            it.each(arrange)("should return $searchParams.page page with $searchParams.per_page items", async (item) => {
                const result = await repository.search(item.searchParams);
                expect(omit(result, 'items')).toEqual(omit(item.searchResult, 'items'));
                expect(result.items.map(e => e.toJson())).toEqual(
                    item.searchResult.items.map(e => e.toJson())
                );
            });
        });

    });

});