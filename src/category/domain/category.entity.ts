import { Entity } from "../../shared/domain/entity";
import { EntityValidationError } from "../../shared/domain/validators/validation.errors";
import { Uuid } from "../../shared/domain/value-objects/uui.vo";
import { CategoryFakeBuilder } from "./category.fake.builder";
import { CategoryValidatorFacotry } from "./category.validator";

export type CategoryContructorProps = {
    category_id?: Uuid;
    name: string;
    description?: string | null;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export type CategoryCreateCommand = {
    name: string;
    description?: string | null;
    is_active?: boolean;
}

export class Category extends Entity {

    category_id: Uuid;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;

    constructor(props: CategoryContructorProps) {
        super();
        this.category_id = props.category_id ?? new Uuid();
        this.name = props.name;
        this.description = props.description ?? null;
        this.is_active = props.is_active ?? true;
        this.created_at = props.created_at ?? new Date();
    }

    static create(props: CategoryCreateCommand): Category {
        const category = new Category(props);
        // Category.validate();
        category.validate(['name'])
        return category;
    }


    changeName(name: string): void {
        this.name = name;
        this.validate(['name'])
    }

    changeDescription(description: string | null): void {
        this.description = description;
    }

    activate(): void {
        //Como nao tem input de dados, nao precisa de ter o validate
        this.is_active = true;
    }

    deactivate(): void {
        this.is_active = false;
    }

    validate(fields?: string[]) {
        const validator = CategoryValidatorFacotry.create();
        return validator.validate(this.notification, this, fields);
    }

    static fake() {
        return CategoryFakeBuilder;
    }

    toJson() {
        return {
            category_id: this.category_id.id,
            name: this.name,
            description: this.description,
            is_active: this.is_active,
            created_at: this.created_at
        }
    }

    get entity_id(): Uuid {
        return this.category_id;
    }
}