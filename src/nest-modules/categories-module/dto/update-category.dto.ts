import { UpdateCategoryInput } from '@core/category/application/use-case/update-category/update-category-input';
import { OmitType } from '@nestjs/mapped-types';


export class UpdateCategoryInputWithOutId extends OmitType(UpdateCategoryInput, [
    'id'
] as const) { }

export class UpdateCategoryDto extends UpdateCategoryInputWithOutId { }
