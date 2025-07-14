import { SearchParams } from "@core/shared/domain/repository/search-params";
import { SearchResult } from "@core/shared/domain/repository/search-result";
import { CastMember } from "./cast-member.entity";
import { ISearchableRepository } from "@core/shared/domain/repository/repository-interface";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";



export type CastMemberFilter = string;

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> { };

export class CastMemberSearchResult extends SearchResult<CastMember> { };

export interface ICastMemberRepository extends ISearchableRepository<
    CastMember,
    Uuid,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
> { }
