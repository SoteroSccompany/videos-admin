import { IUseCase } from "../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../shared/domain/error/not-found.error";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.errors";
import { Uuid } from "../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "../common/category-output";
import { UpdateCategoryInput } from "./update-category-input";



export class UpdateCategoryUseCase
    implements IUseCase<UpdateCategoryInput, UpdateCategoryUseCaseOutput> {

    constructor(private readonly categoryRepo: ICategoryRepository) { }

    async execute(input: UpdateCategoryInput): Promise<UpdateCategoryUseCaseOutput> {
        const uuid = new Uuid(input.id);
        const entity = await this.categoryRepo.findById(uuid);

        if (!entity) {
            throw new NotFoundError(input.id, Category)
        }

        input.name && entity.changeName(input.name);
        if (input.description !== undefined) {
            entity.changeDescription(input.description);
        }

        if (input.is_active === true) entity.activate();
        if (input.is_active === false) entity.deactivate();

        if (entity.notification.hasError()) {
            throw new EntityValidationError(entity.notification.toJson())
        }

        await this.categoryRepo.update(entity);

        return CategoryOutputMapper.toOutput(entity);
    }
}



export type UpdateCategoryUseCaseOutput = CategoryOutput;