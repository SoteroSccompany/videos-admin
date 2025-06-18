import { ValueObject } from "../../value-object";



class Vo extends ValueObject {

    protected _name: string;

    constructor(name: string) {
        super()
        this._name = name;
    }

    get name() {
        return this._name;
    }
}

class AnotherClass {

}

describe("Value Object Unit Tests", () => {


    it("should compare value objects", () => {
        const name = "nathaniel";
        const vo1 = new Vo(name)
        const vo2 = new Vo(name)
        const equalSpy = jest.spyOn(vo1, "equals")
        vo1.equals(vo2);
        expect(equalSpy).toHaveBeenCalled();

    });

    it("should compare value objects when value object is undefined", () => {
        const name = "nathaniel";
        const vo1 = new Vo(name)
        const vo2 = undefined as any;
        const isEqual = vo1.equals(vo2);
        expect(isEqual).toBeFalsy();

    });

    it("should compare value objects when second object is not valueObject", () => {
        const name = "nathaniel";
        const vo1 = new Vo(name)
        const vo2 = new AnotherClass() as any;
        const isEqual = vo1.equals(vo2);
        expect(isEqual).toBeFalsy();

    });


});