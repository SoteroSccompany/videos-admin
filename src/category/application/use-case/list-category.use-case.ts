import { PaginationOutPut, PaginationOutputMapper } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/error/not-found.error";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../domain/category.entity";
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";



export class ListCategoryUseCase
    implements IUseCase<ListCategoryUseCaseInput, ListCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: ListCategoryUseCaseInput): Promise<ListCategoryUseCaseOutput> {
        const params = new CategorySearchParams(input);
        const searchResult = await this.categoryRepo.search(params);
        return this.toOutput(searchResult);
    }


    private toOutput(searchResult: CategorySearchResult): ListCategoryUseCaseOutput {
        const { items: _items } = searchResult;
        const items = _items.map((item) => CategoryOutputMapper.toOutput(item));
        return PaginationOutputMapper.toOutput(items, searchResult);

    }
}


export type ListCategoryUseCaseInput = {
    page?: number;
    per_page?: number;
    sort?: string | null;
    sort_dir?: SortDirection | null;
    filter?: CategoryFilter;
};

export type ListCategoryUseCaseOutput = PaginationOutPut<CategoryOutput>;