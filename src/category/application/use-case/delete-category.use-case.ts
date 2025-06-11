import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/error/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";



export class DeleteCategoryUseCase
    implements IUseCase<DeleteCategoryUseCaseInput, DeleteCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: DeleteCategoryUseCaseInput): Promise<DeleteCategoryUseCaseOutput> {
        const uuid = new Uuid(input.id);
        const entity = await this.categoryRepo.findById(uuid);
        if (!entity) {
            throw new NotFoundError(input.id, Category)
        }
        await this.categoryRepo.delete(entity.entity_id);
    }
}


export type DeleteCategoryUseCaseInput = {
    id: string;
}

export type DeleteCategoryUseCaseOutput = void;