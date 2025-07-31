import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/cast-member-output";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";





export type GetCastMemberInput = {
    id: string;
}


export class GetCastMemberUsecase implements IUseCase<GetCastMemberInput, GetCastMemberOutput> {

    constructor(private readonly castMemberRepository: ICastMemberRepository) { }

    async execute(input: GetCastMemberInput): Promise<GetCastMemberOutput> {
        const uuid = new Uuid(input.id);
        const castMember = await this.castMemberRepository.findById(uuid);
        if (!castMember) {
            throw new NotFoundError(input.id, this.castMemberRepository.getEntity());
        }
        return CastMemberOutputMapper.toOutput(castMember);
    }
}






export type GetCastMemberOutput = CastMemberOutput;