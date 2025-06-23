import { idText } from "typescript";
import { NotFoundError } from "../../../../shared/domain/error/not-found.error";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { SearchResult } from "../../../../shared/domain/repository/search-result";
import { Uuid } from "../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../domain/category.entity";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../../domain/category.repository";
import { CategoryModel } from "./category.model";
import { Op } from "sequelize";
import { CategoryModelMapper } from "./category-model-mapper";
import { Injectable } from "@nestjs/common";



export class CategorySequelizeRepository implements ICategoryRepository {

    sortableFields: string[] = ["name", "created_at"];

    constructor(private categoryModel: typeof CategoryModel) { }

    async insert(entity: Category): Promise<void> {
        const model = CategoryModelMapper.toModel(entity);
        await this.categoryModel.create(model.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const modelProps = entities.map(entity => CategoryModelMapper.toModel(entity).toJSON());
        await this.categoryModel.bulkCreate(modelProps);
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }
        const modelProps = CategoryModelMapper.toModel(entity);
        await this.categoryModel.update(modelProps.toJSON(), {
            where: { category_id: id }
        });
    }


    async delete(category_id: Uuid): Promise<void> {
        const id = category_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }
        await this.categoryModel.destroy({ where: { category_id: id } });
    }

    async findById(entity_id: Uuid): Promise<Category | null> {
        const model = await this._get(entity_id.id)
        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    private async _get(id: string) {
        return await this.categoryModel.findByPk(id);
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        if (!models || models.length === 0) {
            return [];
        }
        return models.map(model => CategoryModelMapper.toEntity(model));
    }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        //Se faz uma query para contar 
        //Depois se faz uma query para retornar.
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;
        const { rows: models, count } = await this.categoryModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` }
                }
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? { order: [[props.sort, props.sort_dir]] }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });
        return new CategorySearchResult({
            items: models.map(model => CategoryModelMapper.toEntity(model)),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        })
    }


    getEntity(): new (...args: any[]) => Category {
        return Category;
    }

}