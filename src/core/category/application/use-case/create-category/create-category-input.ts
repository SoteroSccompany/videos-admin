import { IsBoolean, IsNotEmpty, IsOptional, IsString, validateSync } from "class-validator";



export type CreateCategoryInputContructorProps = {
    name: string;
    description?: string | null;
    is_active?: boolean;
}

export class CreateCategoryInput {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    is_active: boolean;

    constructor(props: CreateCategoryInputContructorProps) {
        if (!props) return;
        this.name = props.name;
        this.description = props.description;
        this.is_active = props.is_active;
    }
}


export class CreateCategoryInputValidate {
    static validate(input: CreateCategoryInput) {
        return validateSync(input);
    }
}