import { ValueObject } from "../value-object";


class StringValueObject extends ValueObject {
    constructor(readonly value: string) {
        super();
    }

};

class ComplexValueObject extends ValueObject {
    constructor(readonly value: string, readonly value2: number) {
        super();
    }
}

describe("Value Object Unit Tests", () => {

    test("shoud be equal", () => {
        const vo1 = new StringValueObject("value");
        const vo2 = new StringValueObject("value");
        expect(vo1.equals(vo2)).toBeTruthy();


        const vo3 = new ComplexValueObject("value", 1);
        const vo4 = new ComplexValueObject("value", 1);
        expect(vo3.equals(vo4)).toBeTruthy();

    });

    test("shoud be different", () => {
        const vo1 = new StringValueObject("value");
        const vo2 = new StringValueObject("value2");
        expect(vo1.equals(vo2)).toBeFalsy();
        const vo3 = new ComplexValueObject("value", 1);
        const vo4 = new ComplexValueObject("value", 2);
        expect(vo3.equals(vo4)).toBeFalsy();
        const vo5 = new ComplexValueObject("value", 1);
        const vo6 = new ComplexValueObject("value2", 1);
        expect(vo5.equals(vo6)).toBeFalsy();

    });



})