import { IUseCase } from "@core/shared/application/use-case.interface";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/cast-member-output";
import { UpdateCastMemberInput } from "./update-cast-member.input";
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";




export class UpdateCastMemberUsecase implements IUseCase<UpdateCastMemberInput, UpdateCastMemberOutPut> {

    constructor(private readonly castMemberRepository: ICastMemberRepository) { }

    async execute(input: UpdateCastMemberInput): Promise<UpdateCastMemberOutPut> {
        const uuid = new Uuid(input.id);
        const castMember = await this.castMemberRepository.findById(uuid);
        if (!castMember) {
            throw new NotFoundError(input.id, this.castMemberRepository.getEntity());
        }
        castMember.changeName(input.name);
        if (input.cast_member_type !== undefined) {
            castMember.changeMemberType(input.cast_member_type);
        }
        if (castMember.notification.hasError()) {
            throw new EntityValidationError(castMember.notification.toJson());
        }
        await this.castMemberRepository.update(castMember);
        return CastMemberOutputMapper.toOutput(castMember);
    }
}


export type UpdateCastMemberOutPut = CastMemberOutput;