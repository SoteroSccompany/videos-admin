import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberModel } from "./cast-member.model";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { CastMemberType } from "@core/cast-member/domain/cast-member-type.vo";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";




export class CastMemberModelMapper {

    static toModel(entity: CastMember) {
        return CastMemberModel.build({
            cast_member_id: entity.cast_member_id.id,
            name: entity.name,
            cast_member_type: entity.cast_member_type.cast_member_type,
            created_at: entity.created_at,
        })
    }


    static toEntity(model: CastMemberModel): CastMember {
        const castMember = new CastMember({
            cast_member_id: model.cast_member_id ? new Uuid(model.cast_member_id) : undefined,
            name: model.name,
            cast_member_type: new CastMemberType(model.cast_member_type),
            created_at: model.created_at,
        });
        castMember.validate();
        if (castMember.notification.hasError()) {
            throw new EntityValidationError(castMember.notification.toJson());
        }

        return castMember;
    }

}