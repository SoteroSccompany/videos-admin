import { validateSync } from "class-validator";
import { FieldsErrors, IValidatorFields } from "./validator-fields.interface";
import { Notification } from "./notification";


export abstract class ClassValidatorFields<PropsValidated> implements IValidatorFields {

    validate(notifications: Notification, data: any, fields: string[]): boolean {
        const errors = validateSync(data, {
            groups: fields
        });
        if (errors.length) {
            for (const error of errors) {
                const field = error.property;
                Object.values(error.constraints!).forEach(message => {
                    notifications.addError(message, field)
                })
            }
        }
        return !errors.length;
    }

}