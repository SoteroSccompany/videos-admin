import { CastMember } from "@core/cast-member/domain/cast-member.entity";



export type CastMemberOutput = {
    id: string;
    name: string;
    cast_member_type: string;
    created_at: Date;
}



export class CastMemberOutputMapper {

    static toOutput(entity: CastMember): CastMemberOutput {
        const { cast_member_id, ...otherProps } = entity.toJson();
        return {
            id: cast_member_id,
            ...otherProps,
        };
    }
}