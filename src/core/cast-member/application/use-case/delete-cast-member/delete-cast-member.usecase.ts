import { ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { NotFoundError } from "@core/shared/domain/error/not-found.error";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";





export type DeleteCastMemberInput = {
    id: string;
}


export class DeleteCastMemberUsecase implements IUseCase<DeleteCastMemberInput, void> {

    constructor(private readonly castMemberRepository: ICastMemberRepository) { }

    async execute(input: DeleteCastMemberInput): Promise<void> {
        const uuid = new Uuid(input.id);
        const castMember = await this.castMemberRepository.findById(uuid);
        if (!castMember) {
            throw new NotFoundError(input.id, this.castMemberRepository.getEntity());
        }
        await this.castMemberRepository.delete(castMember.cast_member_id);
    }
}