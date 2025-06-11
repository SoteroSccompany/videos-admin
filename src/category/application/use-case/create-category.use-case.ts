import { IUseCase } from "../../../shared/application/use-case.interface";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";



export class CreateCategoryUseCase implements IUseCase<CreateCategoryUseCaseInput, CreateCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: CreateCategoryUseCaseInput): Promise<CreateCategoryUseCaseOutput> {
        const entity = Category.create(input)
        this.categoryRepo.insert(entity);
        return CategoryOutputMapper.toOutput(entity);
    }
}

export type CreateCategoryUseCaseInput = {
    name: string;
    description?: string | null;
    is_active?: boolean;
}

export type CreateCategoryUseCaseOutput = CategoryOutput;