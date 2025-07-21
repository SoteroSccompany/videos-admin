import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberSequelizeRepository } from "../cast-member.repository";
import { CastMemberModel } from "../cast-member.model";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo";
import { CastMemberSearchParams } from "@core/cast-member/domain/cast-member.repository";




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


    // describe("search method", () => {

    //     it("should only apply pagination when no filters are provided", async () => {
    //         const created_at = new Date();
    //         const name = "Cast Member";
    //         const cast_member_type = new CastMemberType(1);
    //         const entities = CastMember.fake()
    //             .theCastMembers(3)
    //             .withName(name)
    //             .withCastMemberType(cast_member_type)
    //             .withCreatedAt(created_at)
    //             .build();

    //         await repository.bulkInsert(entities);
    //         expect(true).toBeTruthy(); // Placeholder for actual search test
    //         const searchParams = new CastMemberSearchParams();
    //         const result = await repository.search(searchParams);
    //         expect(result.items.length).toBe(3);
    //         expect(result).toMatchObject({
    //             items: entities,
    //             total: 3,
    //             current_page: 1,
    //             per_page: 15,
    //             last_page: 1,
    //         });

    //     });

    // });

});