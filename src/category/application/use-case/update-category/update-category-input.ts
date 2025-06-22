import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";



export type UpdateCategoryInputConstructorProps = {
    id: string
    name?: string;
    description?: string | null;
    is_active?: boolean;
}


export class UpdateCategoryInput {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    is_active: boolean;

    constructor(props: UpdateCategoryInputConstructorProps) {
        if (!props) return;
        this.id = props.id;
        props.name && (this.name = props.name);
        props.description && (this.description = props.description);
        props.is_active !== null &&
            props.is_active !== undefined
            && (this.is_active = props.is_active);

    }
}


export class UpdateCategoryInputValidate {
    static validate(input: UpdateCategoryInput) {
        return validateSync(input)
    }
}