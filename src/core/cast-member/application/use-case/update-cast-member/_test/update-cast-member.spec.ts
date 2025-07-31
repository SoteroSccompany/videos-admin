import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { UpdateCastMemberUsecase } from "../update-cast-member.usecase";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { UpdateCastMemberInput } from "../update-cast-member.input";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";
import { InvalidCastMemberTypeError } from "@core/cast-member/domain/cast-member-type.vo";





describe("UpdateCastMemberUseCase Unit Test", () => {

    let repository: CastMemberInMemoryRepository;
    let useCase: UpdateCastMemberUsecase;
    let castMember: CastMember;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new UpdateCastMemberUsecase(repository);
        castMember = CastMember.create({
            name: "Cast Member",
            cast_member_type: 1
        });
        repository.items.push(castMember);
    });


    it("should throw error when entity not found", async () => {
        const input = new UpdateCastMemberInput({ id: "fake uuid", name: "New Name" });
        await expect(() => useCase.execute(input))
            .rejects.toThrow("Invalid UUID: fake uuid");

        const uuid = new Uuid().id;
        const notFoundInput = new UpdateCastMemberInput({ id: `${uuid}`, name: "New Name" });
        await expect(() => useCase.execute(notFoundInput))
            .rejects.toThrow(new NotFoundError(uuid, repository.getEntity()));
    });

    it("shhould throw error when entity not valid", async () => {
        const input = new UpdateCastMemberInput({ id: castMember.cast_member_id.id, name: "N".repeat(256) });
        await expect(() => useCase.execute(input))
            .rejects.toThrow(EntityValidationError);
    });

    it("should throw error when cast member type is invalid", async () => {
        const input = new UpdateCastMemberInput({ id: castMember.cast_member_id.id, name: "New Name", cast_member_type: 3 });
        await expect(() => useCase.execute(input))
            .rejects.toThrow(InvalidCastMemberTypeError);
    });

    it("should update a cast member", async () => {
        const spyUpdate = jest.spyOn(repository, "update");
        const spyFindById = jest.spyOn(repository, "findById");

        type Arrange = {
            input: {
                id: string;
                name: string;
                cast_member_type?: number;
            };
            expected: {
                id: string;
                name: string;
                cast_member_type: string;
                created_at: Date;
            };
        };

        const arrange: Arrange[] = [
            {
                input: {
                    id: castMember.cast_member_id.id,
                    name: "Updated Name",
                    cast_member_type: 2
                },
                expected: {
                    id: castMember.cast_member_id.id,
                    name: "Updated Name",
                    cast_member_type: "2_Director",
                    created_at: castMember.created_at
                }
            },
            {
                input: {
                    id: castMember.cast_member_id.id,
                    name: "Another Update",
                    cast_member_type: 1
                },
                expected: {
                    id: castMember.cast_member_id.id,
                    name: "Another Update",
                    cast_member_type: "1_Actor",
                    created_at: castMember.created_at
                }
            }
        ];

        for (const i of arrange) {
            let input = new UpdateCastMemberInput(i.input);
            let output = await useCase.execute(input);
            expect(output).toStrictEqual({
                id: i.expected.id,
                name: i.expected.name,
                cast_member_type: i.expected.cast_member_type,
                created_at: i.expected.created_at,
            });
        }
        expect(spyUpdate).toHaveBeenCalledTimes(arrange.length);
        expect(spyFindById).toHaveBeenCalledTimes(arrange.length);




    });

});

