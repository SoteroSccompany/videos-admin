import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { CreateCastMemberUsecase } from "../create-cast-member.usecase";
import { CastMemberName } from "@core/cast-member/domain/cast-member-type.vo";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { CastMemberModel } from "@core/cast-member/infra/db/sequelize/cast-member.model";
import { CastMemberSequelizeRepository } from "@core/cast-member/infra/db/sequelize/cast-member.repository";





describe('CreateCastMemberUseCase Int Tests', () => {

    setupSequelize({ models: [CastMemberModel] })

    let repository: CastMemberSequelizeRepository;
    let useCase: CreateCastMemberUsecase;

    beforeEach(() => {
        repository = new CastMemberSequelizeRepository(CastMemberModel);
        useCase = new CreateCastMemberUsecase(repository);
    });


    it('should insert a cast member', async () => {
        const input = {
            name: 'John Doe',
            cast_member_type: 1
        };
        const spyInsert = jest.spyOn(repository, 'insert');
        const output = await useCase.execute(input);
        expect(spyInsert).toHaveBeenCalledTimes(1);
        expect(output.name).toBe(input.name);
        expect(output.cast_member_type).toBe(`${input.cast_member_type}_${CastMemberName[input.cast_member_type]}`);
        const checkInsert = await CastMemberModel.findByPk(output.id);
        expect(checkInsert).toBeDefined();
        expect(checkInsert?.cast_member_id).toBe(output.id);
        expect(checkInsert?.name).toBe(input.name);
        expect(checkInsert?.cast_member_type).toBe(input.cast_member_type);
        expect(checkInsert?.created_at).toBeDefined();
    });


    it("should throw an error when cast member name is too long", async () => {
        const input = {
            name: 'a'.repeat(256),
            cast_member_type: 1
        };
        await expect(() => useCase.execute(input)).rejects.toThrow(
            'Entity Validation Error'
        );
    });

    it("should throw an error when cast member type is invalid", async () => {
        const input = {
            name: 'John Doe',
            cast_member_type: 3 // Invalid type
        };
        await expect(() => useCase.execute(input)).rejects.toThrow(
            'Ivalid cast member type. Allowed values are 1 or 2'
        );
    });

    // Add more unit tests here

});