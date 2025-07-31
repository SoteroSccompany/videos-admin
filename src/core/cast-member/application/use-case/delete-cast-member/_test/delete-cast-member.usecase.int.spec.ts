
import { DeleteCastMemberUsecase } from "../delete-cast-member.usecase";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model";
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member.repository";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { InvalidUuidError, Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { setupSequelize } from "@core/shared/infra/testing/helpers";





describe('DeleteCastMemberUseCase Int Tests', () => {

    setupSequelize({ models: [CastMemberModel] });
    let repository: CastMemberSequelizeRepository;
    let useCase: DeleteCastMemberUsecase;
    let castMember: CastMember;

    beforeEach(async () => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new DeleteCastMemberUsecase(repository);
        castMember = CastMember.fake().aCastMember().build();
        const haveCastMember = await repository.findById(castMember.cast_member_id);
        if (!haveCastMember) {
            await repository.insert(castMember);
        }
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
        const spyFindById = jest.spyOn(repository, "findById")
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

    it("should delete a cast member", async () => {
        const input = {
            id: castMember.cast_member_id.id
        }
        const spyFindById = jest.spyOn(repository, "findById");
        const spyDelete = jest.spyOn(repository, "delete");

        await useCase.execute(input);

        expect(spyFindById).toHaveBeenCalledWith(new Uuid(input.id));
        expect(spyDelete).toHaveBeenCalledWith(castMember.cast_member_id);
        const checkCastMember = await repository.findById(castMember.cast_member_id);
        expect(checkCastMember).toBeNull();
        const checkModel = await CastMemberModel.findByPk(castMember.cast_member_id.id);
        expect(checkModel).toBeNull();
    });

});