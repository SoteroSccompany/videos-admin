import { InvalidUuidError, Uuid } from "../uui.vo";



describe("UUID Value Object Unit Tests", () => {

    const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");

    test("should throw erro when uuid is invalid", () => {
        expect(() => {
            new Uuid("invalid-uuid");
        }).toThrow(new InvalidUuidError("Invalid UUID: invalid-uuid"));
        expect(validateSpy).toHaveBeenCalled();
    });

    test("should create a valid uuid", () => {
        const uuid = new Uuid();
        expect(uuid.id).toBeDefined();
        expect(validateSpy).toHaveBeenCalled();
    });

    test("should accept a valid uuid", () => {
        const uuid = new Uuid("550e8400-e29b-41d4-a716-446655440000");
        expect(uuid.id).toBe("550e8400-e29b-41d4-a716-446655440000");
        expect(validateSpy).toHaveBeenCalled();
    });

    it("should message erro set", () => {
        const message = 'testeMessage'
        const error = new InvalidUuidError(message);
        expect(error.message).toBe(message);
        expect(error.name).toBe("InvalidUuidError");
    });

});