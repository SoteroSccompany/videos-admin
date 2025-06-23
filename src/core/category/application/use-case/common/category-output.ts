import { Category } from "../../../domain/category.entity";



export type CategoryOutput = {
    id: string;
    name: string;
    description: null | string;
    is_active: boolean;
    created_at: Date;
}


export class CategoryOutputMapper {
    static toOutput(entity: Category): CategoryOutput {
        const { category_id, ...otherProps } = entity.toJson();
        return {
            id: category_id,
            ...otherProps,
        };
    }
}