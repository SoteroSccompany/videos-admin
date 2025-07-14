import { Entity } from "@core/shared/domain/entity";
import { Uuid } from "@core/shared/domain/value-objects/uui.vo";
import { CastMemberType } from "./cast-member-type.vo";
import { CastMemberValidatorFactory } from "./cast-member.validator";
import { CastMemberFakeBuilder } from "./cast-member.fake.builder";


export type CastMemberConstructorProps = {
    cast_member_id?: Uuid;
    name: string;
    cast_member_type: CastMemberType;
    created_at?: Date;
}

export type CastMemberCommand = {
    name: string;
    cast_member_type: CastMemberType;
}


export class CastMember extends Entity {

    cast_member_id?: Uuid;
    name: string;
    cast_member_type: CastMemberType;
    created_at?: Date;

    constructor(props: CastMemberConstructorProps) {
        super();
        this.cast_member_id = props.cast_member_id ?? new Uuid();
        this.name = props.name;
        this.cast_member_type = props.cast_member_type;
        this.created_at = props.created_at ?? new Date();
    }

    static create(props: CastMemberCommand): CastMember {
        const castMember = new CastMember(props);
        castMember.validate(['name'])
        return castMember;
    }

    changeName(name: string) {
        this.name = name;
        this.validate(['name'])
    }

    changeMemberType(memberType: number) {
        const castMemberType = new CastMemberType(memberType);
        this.cast_member_type = castMemberType;
    }



    get entity_id(): Uuid {
        return this.cast_member_id;
    }

    toJson() {
        return {
            cast_member_id: this.entity_id.id,
            name: this.name,
            cast_member_type: this.cast_member_type.toString(),
            created_at: this.created_at
        }
    }

    validate(fields?: string[]) {
        const validate = CastMemberValidatorFactory.create();
        return validate.validate(this.notification, this, fields)
    }

    static fake() {
        return CastMemberFakeBuilder;
    }


}