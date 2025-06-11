import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/error/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";



export class GetCategoryUseCase
    implements IUseCase<GetCategoryUseCaseInput, GeteCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: GetCategoryUseCaseInput): Promise<GeteCategoryUseCaseOutput> {
        const uuid = new Uuid(input.id);
        const entity = await this.categoryRepo.findById(uuid);
        if (!entity) {
            throw new NotFoundError(input.id, Category)
        }
        return CategoryOutputMapper.toOutput(entity);
    }
}


export type GetCategoryUseCaseInput = {
    id: string;
}

export type GeteCategoryUseCaseOutput = CategoryOutput;