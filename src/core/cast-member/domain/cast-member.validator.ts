import { MaxLength } from "class-validator";
import { CastMember } from "./cast-member.entity";
import { ClassValidatorFields } from "@core/shared/domain/validators/class-validator-fields";
import { Notification } from "@core/shared/domain/validators/notification";



export class CastMemberRules {

    @MaxLength(255, { groups: ['name'] })
    name: string;

    constructor(entity: CastMember) {
        Object.assign(this, entity)
    }
}

export class CastMemberValidator extends ClassValidatorFields<CastMemberRules> {

    validate(notification: Notification, data: any, fields?: string[]) {
        const newFields = fields?.length ? fields : ['name'];
        return super.validate(notification, new CastMemberRules(data), newFields);
    }
}

export class CastMemberValidatorFactory {
    static create() {
        return new CastMemberValidator();
    }
}
