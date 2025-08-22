import { CategoryOutput } from "@core/category/application/use-case/common/category-output";
import { ListCategoryUseCaseInput, ListCategoryUseCaseOutput } from "@core/category/application/use-case/list-categories/list-categories.use-case";
import { Transform } from "class-transformer";
import { CollectionPresenter } from "../shared-module/collection.presenter";



export class CategoryPresenter {
    id: string
    name: string;
    description: string | null;
    is_active: boolean;
    @Transform(({ value }: { value: Date }) => value.toISOString())
    created_at: Date;

    constructor(output: CategoryOutput) {
        this.id = output.id;
        this.name = output.name;
        this.description = output.description;
        this.is_active = output.is_active;
        this.created_at = output.created_at;
    }
}

export class CategoryCollectionPresenter extends CollectionPresenter {

    data: CategoryPresenter[];

    constructor(output: ListCategoryUseCaseOutput) {
        const { items, ...paginationProps } = output; //Ali faz o destruct dentro da constante pagination props.
        super(paginationProps)
        this.data = items.map((i) => new CategoryPresenter(i));
    }

}