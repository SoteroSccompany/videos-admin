import { Notification } from "./notification";


export type FieldsErrors =
    | {
        [field: string]: string[];
    }
    | string;

export interface IValidatorFields {
    validate(notifications: Notification, data: any, fields: string[]): boolean;
}