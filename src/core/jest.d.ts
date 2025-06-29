import { FieldsErrors } from "./shared/domain/validators/validator-fields.interface";

declare global {
    namespace jest {
        interface Matchers<R> {
            // containsErrorMessages: (expected: FieldsErrors) => R;
            notificationContainsErrorMessage: (
                expected: Array<string | { [key: string]: string[] }>,
            ) => R
        }
    }
}