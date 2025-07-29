import { CastMemberFilter, ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uui.vo";
import { InMemoryRepository, InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory/in-memory.repository";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";


export class CastMemberInMemoryRepository extends InMemorySearchableRepository<CastMember, Uuid>
    implements ICastMemberRepository {

    sortableFields: string[] = ["name", "cast_member_type", "created_at"];


    protected async applyFilter(items: CastMember[], filter: CastMemberFilter): Promise<CastMember[]> {
        if (!filter) {
            return items;
        }
        return items.filter((i) => {
            return (
                i.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
                i.cast_member_type.toString()?.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
            );
        });
    }

    protected applySort(items: CastMember[], sort: string | null, sort_dir: SortDirection | null) {
        return sort ? super.applySort(items, sort, sort_dir) : super.applySort(items, 'created_at', "desc")

    }

    getEntity(): new (...args: any[]) => CastMember {
        return CastMember;
    }

}