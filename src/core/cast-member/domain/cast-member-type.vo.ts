import { ValueObject } from "@core/shared/domain/value-object";



export enum CastMemberName {
    Actor = 1,
    Director = 2
}

export class CastMemberType extends ValueObject {

    readonly _cast_member_type: number;
    private cast_member_name: string;


    constructor(type: number) {
        super()
        this._cast_member_type = type;
        this.validate();
    }

    private validate() {
        if (this._cast_member_type !== 1 && this._cast_member_type !== 2) {
            throw new InvalidCastMemberTypeError(`Ivalid cast member type. Allowed values are 1 or 2`);
        }
        this.cast_member_name = CastMemberName[this._cast_member_type as CastMemberName]
    }

    toString() {
        return `${this._cast_member_type}_${this.cast_member_name}`
    }

    get cast_member_type() {
        return this._cast_member_type;
    }

}


export class InvalidCastMemberTypeError extends Error {
    constructor(message: string) {
        super(message || 'Cast member type must be valid.');
        this.name = "InvalidCastMemberType"
    }

}