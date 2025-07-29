import { IsNotEmpty, IsNumber, IsString, MaxLength, validateSync } from "class-validator";



export type CreateCastMemberInputConstructorProps = {
    name: string;
    cast_member_type: number;
}

export class CreateCastMemberInput {

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @MaxLength(2)
    cast_member_type: number;

    constructor(props: CreateCastMemberInputConstructorProps) {
        if (!props) return;
        this.name = props.name;
        this.cast_member_type = props.cast_member_type;
    }

}


export class CreateCastMemberInputValidate {
    static validate(input: CreateCastMemberInput) {
        return validateSync(input);
    }
}