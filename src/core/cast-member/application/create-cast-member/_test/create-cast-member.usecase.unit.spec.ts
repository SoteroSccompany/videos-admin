import { CastMemberInMemoryRepository } from "@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository";
import { CreateCastMemberUsecase } from "../create-cast-member.usecase";
import { CastMemberName } from "@core/cast-member/domain/cast-member-type.vo";





describe('CreateCastMemberUseCase Unit Tests', () => {

    let repository: CastMemberInMemoryRepository;
    let useCase: CreateCastMemberUsecase;

    beforeEach(() => {
        repository = new CastMemberInMemoryRepository();
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
        expect(repository.items).toHaveLength(1);
        const input2 = {
            name: 'Jane Doe',
            cast_member_type: 2
        }
        const output2 = await useCase.execute(input2);
        expect(spyInsert).toHaveBeenCalledTimes(2);
        expect(repository.items[0].cast_member_id.id).toBe(output.id);
        expect(repository.items[1].cast_member_id.id).toBe(output2.id);

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