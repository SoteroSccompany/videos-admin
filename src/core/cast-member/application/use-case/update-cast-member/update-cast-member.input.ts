import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, validateSync } from "class-validator";



export type UpdateCastMemberInputConstructorProps = {
    id: string;
    name: string;
    cast_member_type?: number;
}

export class UpdateCastMemberInput {

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsNumber()
    @MaxLength(2)
    cast_member_type: number;

    constructor(props: UpdateCastMemberInputConstructorProps) {
        if (!props) return;
        this.id = props.id;
        this.name = props.name;
        props.cast_member_type !== undefined &&
            props.cast_member_type !== null &&
            (this.cast_member_type = props.cast_member_type);
    }

}


export class UpdateCastMemberInputValidate {
    static validate(input: UpdateCastMemberInput) {
        return validateSync(input);
    }
}