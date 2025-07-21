import { CastMemberSearchParams, CastMemberSearchResult, ICastMemberRepository } from "@core/cast-member/domain/cast-member.repository";
import { CastMemberModel } from "./cast-member.model";
import { SortDirection } from "@core/shared/domain/repository/search-params";
import { literal, Op } from "sequelize";
import { CastMember } from "@core/cast-member/domain/cast-member.entity";
import { CastMemberModelMapper } from "./cast-member-model-mapper";
import { NotFoundError } from "../../../../shared/domain/error/not-found.error";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";






export class CastMemberSequelizeRepository implements ICastMemberRepository {

    sortableFields: string[] = ["name", "cast_member_type", "created_at"];

    orderBy = {
        mysql: {
            name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
        },
    };

    constructor(private castMemberModel: typeof CastMemberModel) { }


    async insert(enity: CastMember): Promise<void> {
        const model = CastMemberModelMapper.toModel(enity);
        await this.castMemberModel.create(model.toJSON());
    }

    async bulkInsert(entities: CastMember[]): Promise<void> {
        const modelProps = entities.map(entity => CastMemberModelMapper.toModel(entity).toJSON());
        await this.castMemberModel.bulkCreate(modelProps);
    }

    async update(entity: CastMember): Promise<void> {
        const id = entity.cast_member_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }
        const modelProps = CastMemberModelMapper.toModel(entity);
        await this.castMemberModel.update(modelProps.toJSON(), {
            where: { cast_member_id: id }
        });
    }

    async delete(cast_member_id: Uuid): Promise<void> {
        const id = cast_member_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }
        await this.castMemberModel.destroy({ where: { cast_member_id: id } });
    }

    async findById(entity_id: Uuid): Promise<CastMember | null> {
        const id = entity_id.id;
        const model = await this._get(id);
        return model ? CastMemberModelMapper.toEntity(model) : null;
    }

    async findAll(): Promise<CastMember[]> {
        const models = await this.castMemberModel.findAll();
        return models.map(model => CastMemberModelMapper.toEntity(model));
    }

    async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;
        const { rows: models, count } = await this.castMemberModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` },
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? //? { order: [[props.sort, props.sort_dir]] }
                { order: this.formatSort(props.sort, props.sort_dir!) }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });
        return new CastMemberSearchResult({
            items: models.map((model) => {
                return CastMemberModelMapper.toEntity(model);
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        });
    }


    private formatSort(sort: string, sort_dir: SortDirection) {
        const dialect = this.castMemberModel.sequelize!.getDialect() as 'mysql';
        if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
            return this.orderBy[dialect][sort](sort_dir);
        }
        return [[sort, sort_dir]];
    }



    private async _get(id: string) {
        return this.castMemberModel.findByPk(id);
    }

    getEntity(): new (...args: any[]) => CastMember {
        return CastMember;
    }

}