import { ValueObject } from "@core/shared/domain/value-object";



export enum CastMemberName {
    Actor = 1,
    Director = 2
}

export class CastMemberType extends ValueObject {

    readonly cast_member_type: number;
    private cast_member_name: string;


    constructor(type: number) {
        super()
        this.cast_member_type = type;
        this.validate();
    }

    private validate() {
        if (this.cast_member_type !== 1 && this.cast_member_type !== 2) {
            throw new InvalidCastMemberTypeError(`Ivalid cast member type. Allowed values are 1 or 2`);
        }
        this.cast_member_name = CastMemberName[this.cast_member_type as CastMemberName]
    }

    toString() {
        return `${this.cast_member_type}_${this.cast_member_name}`
    }

}


export class InvalidCastMemberTypeError extends Error {
    constructor(message: string) {
        super(message || 'Cast member type must be valid.');
        this.name = "InvalidCastMemberType"
    }

}