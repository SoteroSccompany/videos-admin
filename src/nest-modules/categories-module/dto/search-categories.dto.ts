import { ListCategoryUseCaseInput } from "@core/category/application/use-case/list-categories/list-categories.use-case";
import { SortDirection } from "@core/shared/domain/repository/search-params";


//Se pode realizar isso, pq ao declarar um tipo, ele pode ser utilizado como interface, se tiver uma estrutura de objeto
export class SearchCategoriesDto implements ListCategoryUseCaseInput {
    page?: number;
    per_page?: number;
    sort?: string | null;
    sort_dir?: SortDirection;
    filter?: string;
}