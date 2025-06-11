import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/error/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";



export class UpdateCategoryUseCase
    implements IUseCase<UpdateCategoryUseCaseInput, UpdateCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: UpdateCategoryUseCaseInput): Promise<UpdateCategoryUseCaseOutput> {
        const uuid = new Uuid(input.id);
        const entity = await this.categoryRepo.findById(uuid);

        if (!entity) {
            throw new NotFoundError(input.id, Category)
        }

        input.name && entity.changeName(input.name);
        if ("description" in input) {
            entity.changeDescription(input.description);
        }

        if (input.is_active === true) entity.activate();
        if (input.is_active === false) entity.deactivate();

        await this.categoryRepo.update(entity);

        return CategoryOutputMapper.toOutput(entity);
    }
}


export type UpdateCategoryUseCaseInput = {
    id: string;
    name?: string;
    description?: string | null;
    is_active?: boolean;
}

export type UpdateCategoryUseCaseOutput = CategoryOutput;