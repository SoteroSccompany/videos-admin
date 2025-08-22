import { ListCastMemberInput } from "@core/cast-member/application/use-case/list-cast-member/list-cast-member.usecase";



export class SearchCastMemberDto implements ListCastMemberInput {
    page?: number;
    per_page?: number;
    sort?: string;
    sort_dir?: "asc" | "desc";
    filter?: string;
}