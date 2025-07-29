import { IUseCase } from "@core/shared/application/use-case.interface";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/cast-member-output";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { EntityValidationError } from "@core/shared/domain/validators/validation.errors";
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { CreateCastMemberInput } from "./create-cast-member.input";





export class CreateCastMemberUsecase implements IUseCase<CreateCastMemberInput, CastMemberOutput> {

    constructor(private readonly castMemberRepository: ICastMemberRepository) { }

    async execute(input: CreateCastMemberInput): Promise<CastMemberOutput> {
        const castMember = CastMember.create(input);
        if (castMember.notification.hasError()) {
            throw new EntityValidationError(castMember.notification.toJson());
        }
        this.castMemberRepository.insert(castMember);
        return CastMemberOutputMapper.toOutput(castMember);
    }
}


export type CreateCastMemberOutputDto = CastMemberOutput;