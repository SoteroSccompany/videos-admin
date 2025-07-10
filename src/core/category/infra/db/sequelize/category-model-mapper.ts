import { IsNotEmptyObject } from "class-validator";
import { Uuid } from "../../../../shared/domain/value-objects/uui.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.errors";
import { Entity } from "@core/shared/domain/entity";



export class CategoryModelMapper {

    static toModel(entity: Category) {
        return CategoryModel.build({
            category_id: entity.category_id.id,
            name: entity.name,
            description: entity.description,
            is_active: entity.is_active,
            created_at: entity.created_at,
        });
    }

    static toEntity(model: CategoryModel): Category {
        const category = new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at,
        });
        category.validate();
        if (category.notification.hasError()) {//Assim permite que se tenha mais controle e dentro do caso de uso em si vai ter isso. 
            throw new EntityValidationError(category.notification.toJson());
        }

        return category;
    }

}