import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberSearchParams, CastMemberSearchResult, ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { PaginationOutPut, PaginationOutputMapper } from "@core/shared/application/pagination-output";
import { IUseCase } from "@core/shared/application/use-case.interface";
import { CastMemberOutput, CastMemberOutputMapper } from "../common/cast-member-output";



export type ListCastMemberInput = {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: "asc" | "desc";
    filter?: string;
}


export class ListCastMemberUsecase implements IUseCase<ListCastMemberInput, ListCastMemberOutput> {

    constructor(private readonly castMemberRepository: ICastMemberRepository) { }

    async execute(input: ListCastMemberInput): Promise<ListCastMemberOutput> {
        const params = new CastMemberSearchParams(input);
        const searchResult = await this.castMemberRepository.search(params);
        return this.toOutput(searchResult)
    }

    private toOutput(searchResult: CastMemberSearchResult): ListCastMemberOutput {
        const { items: _items } = searchResult;
        const items = _items.map(e => CastMemberOutputMapper.toOutput(e));
        return PaginationOutputMapper.toOutput(items, searchResult)

    }
}



export type ListCastMemberOutput = PaginationOutPut<CastMemberOutput>;