import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberOutputMapper } from "./cast-member-output";



describe("CastMemberOutputMapper Unit Tests", () => {

    it("should convert a cast member to output", () => {
        const entity = CastMember.create({
            name: "John Doe",
            cast_member_type: 1
        });
        const spyToJSON = jest.spyOn(entity, "toJson");
        const spyToString = jest.spyOn(entity.cast_member_type, "toString");
        const output = CastMemberOutputMapper.toOutput(entity);
        expect(spyToJSON).toHaveBeenCalled();
        expect(spyToString).toHaveBeenCalled();
        expect(output).toStrictEqual({
            id: entity.cast_member_id.id,
            name: "John Doe",
            cast_member_type: "1_Actor",
            created_at: entity.created_at,
        });
    });
});