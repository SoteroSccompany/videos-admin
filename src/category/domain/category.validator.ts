import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { Category } from "./category.entity";
import { ClassValidatorFields } from "../../shared/domain/validators/class-validator-fields";
import { Notification } from "../../shared/domain/validators/notification";


export class CategoryRules {
    @MaxLength(255, { groups: ['name'] })//artifico do classValidator -> Se faz apenas a validacao do grupo
    name: string;

    constructor(entity: Category) {
        Object.assign(this, entity);
    }
}

export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
    validate(notification: Notification, data: any, fields?: string[]) {
        const newFields = fields?.length ? fields : ['name'];
        return super.validate(notification, new CategoryRules(data), newFields);

    }
}
export class CategoryValidatorFacotry {
    static create() {
        return new CategoryValidator();
    }
}