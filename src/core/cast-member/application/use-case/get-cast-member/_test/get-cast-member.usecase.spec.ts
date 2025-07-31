import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { GetCastMemberUsecase } from "../get-cast-member.usecase";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { InvalidUuidError, Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";




describe("GetCastMemberUsecase Unit Tests", () => {

    let repository: CastMemberInMemoryRepository;
    let useCase: GetCastMemberUsecase;
    let castMember: CastMember;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
        useCase = new GetCastMemberUsecase(repository);
        castMember = CastMember.fake().aCastMember().build();
        repository.items = [castMember];
    });

    it("should throw error when a invalid id is provided", async () => {
        const arrange = {
            input: {
                id: "invalid_id"
            }
        };
        await expect(() => useCase.execute(arrange.input)).rejects.toThrow(InvalidUuidError);
    });

    it("should throw error when cast member not found", async () => {
        const input = {
            id: new Uuid().id
        }
        const spyFindById = jest.spyOn(repository, "findById");
        try {
            await useCase.execute(input);
            fail("Expected NotFoundError to be thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.message).toBe(`${castMember.constructor.name}. Not found using ID(s): ${input.id}`);
            expect(spyFindById).toHaveBeenCalled();
            expect(spyFindById).toHaveBeenCalledWith(new Uuid(input.id));
        }
    });

    it("should find a cast member", async () => {
        const input = {
            id: castMember.cast_member_id.id
        }
        const spyFindById = jest.spyOn(repository, "findById");

        const output = await useCase.execute(input);

        expect(spyFindById).toHaveBeenCalledWith(new Uuid(input.id));
        expect(output).toEqual({
            id: castMember.cast_member_id.id,
            name: castMember.name,
            cast_member_type: castMember.cast_member_type.toString(),
            created_at: castMember.created_at
        });

    });

});